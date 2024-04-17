const fs = require('fs');
const path = require('path');
const { isRegExp } = require('util/types');

class TableService {
	CSVPath;
	CTRPath;
	regexToTablename;

	constructor(DBuser, DBPassword, DBTns, serverOutput) {
		if (!DBuser || !DBPassword || !DBTns) {
			throw new Error('Devem ser definidas as credenciais para acesso ao banco');
		}

		this.serverOutput = serverOutput;
		this.DBTns = DBTns;
		this.DBPassword = DBPassword;
		this.DBuser = DBuser;
	}

	#findDelimiter(header) {
		const delimitersCount = [
			{ name: ',', count: 0 },
			{ name: ';', count: 0 },
			{ name: '|', count: 0 },
			{ name: '#', count: 0 },
		];

		[...header].forEach((letter) => {
			delimitersCount.forEach((delimiter) => {
				if (delimiter.name === letter) {
					delimiter.count++;
				}
			});
		});

		return delimitersCount.reduce(
			(acc, curr) => {
				if (curr.count > acc.count) {
					return curr;
				}

				return acc;
			},
			{ name: '', count: 0 },
		).name;
	}

	#findAllCSVHeader() {
		const CSVHeaderInfo = [];
		const allCSVFilename = fs.readdirSync(this.CSVPath);
		const allCSVInfo = allCSVFilename.map((CSVFilename) => ({
			fullPath: path.join(this.CSVPath, CSVFilename),
			CSVFilename,
		}));

		for (const { fullPath, CSVFilename } of allCSVInfo) {
			const tablename = CSVFilename.match(this.regexToTablename)[1];

			const CSVFile = fs
				.readFileSync(fullPath, {
					encoding: 'utf-8',
				})
				.split('\r\n');

			if (CSVFile.length > 2) {
				const header = CSVFile[0];
				const delimiter = this.#findDelimiter(header);
				const columns = header.split(delimiter).map((col) => col.trim());

				CSVHeaderInfo.push({
					fullPath,
					tablename,
					delimiter,
					columns,
				});
			}
		}

		return CSVHeaderInfo;
	}

	#serverOutput(text) {
		if (this.serverOutput) {
			console.log(text);
		}
	}

	#writeCTR(allCSVHeaderInfo) {
		for (const CSVHeader of allCSVHeaderInfo) {
			const { originPath, tablename, delimiter, columns } = CSVHeader;

			const ctr = `OPTIONS (SKIP=1)
load data
infile '${originPath}'
insert into table ${tablename}
fields terminated by '${delimiter}' OPTIONALLY ENCLOSED BY "'"
TRAILING NULLCOLS
(
	${columns.join(',\r\n   ')}
)`;
			const CTRFullPath = path.join(this.CSVPath, tablename + '.ctr');

			this.#serverOutput(ctr);

			fs.writeFileSync(CTRFullPath, ctr);
		}
	}

	#validateRegex() {
		if (!this.regexToTablename) {
			throw new Error(
				'Primeiro deve ser definido um regex para resolver o nome das tabelas',
			);
		}
	}

	#validateCSV() {
		this.#validateRegex();

		if (!this.CSVPath) {
			throw new Error('Primeiro deve ser definido o caminho do CSV');
		}
	}

	#validateCTR() {
		this.#validateRegex();

		if (!this.CTRPath) {
			throw new Error('Primeiro deve ser definido o caminho do CTR');
		}
	}

	#findAllCTRPath() {
		const allCTRFilename = fs.readdirSync(this.CTRPath);
		const allCTRFullPath = allCTRFilename.map((CTRFilename) =>
			path.join(this.CTRPath, CTRFilename),
		);

		return allCTRFullPath;
	}

	createCTRInto(fullPath) {
		this.#validateCSV();

		this.CTRPath = fullPath;

		const CSVHeaderInfo = this.#findAllCSVHeader();

		this.#writeCTR(CSVHeaderInfo);
	}

	#writeBAT() {
		const allCTRFilename = fs
			.readdirSync(this.CTRPath)
			.map((ctr) => ctr.match(/^(.*)\..*/)[1]);

		const allBATInfo = allCTRFilename.map((CTRFilename) => {
			const BATFilename = CTRFilename + '.bat';
			return {
				fullPath: path.join(this.BATPath, BATFilename),
				BATFilename,
			};
		});

		for (const { fullPath } of allBATInfo) {
			const loader = `sqlldr ${this.DBuser}/${this.DBPassword}@${this.DBTns} CONTROL='${fullPath}'
PAUSE`;

			this.#serverOutput(loader);

			fs.writeFileSync(fullPath, loader);
		}
	}

	createBATInto(fullPath) {
		this.#validateCTR();

		this.BATPath = fullPath;

		const allCTRPath = this.#findAllCTRPath();

		this.#writeBAT(allCTRPath);
	}

	setCSVFolder(CSVPath) {
		this.CSVPath = CSVPath;
	}

	setCTRFolder(CTRPath) {
		this.CTRPath = CTRPath;
	}

	setRegexToTablename(regex) {
		if (isRegExp(regex)) {
			this.regexToTablename = regex;
		}
	}
}

module.exports = TableService;
