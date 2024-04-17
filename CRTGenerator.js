const fs = require('fs');
const path = require('path');
const { isRegExp } = require('util/types');

class CTRGenerator {
	CSVPath;
	regexForTablename;

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
			const tablename = CSVFilename.match(this.regexForTablename)[1];

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
					originPath: fullPath,
					tablename,
					delimiter,
					columns,
				});
			}
		}

		return CSVHeaderInfo;
	}

	#validateCSV() {
		this.#validateRegex();

		if (!this.CSVPath) {
			throw new Error('Primeiro deve ser definido o caminho do CSV');
		}
	}

	#validateRegex() {
		if (!this.regexForTablename) {
			throw new Error(
				'Primeiro deve ser definido um regex para resolver o nome das tabelas',
			);
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
			const CTRFullPath = path.join(this.CTRPath, tablename + '.ctr');

			fs.writeFileSync(CTRFullPath, ctr);
		}
	}

	setRegexForTablename(regex) {
		if (isRegExp(regex)) {
			this.regexForTablename = regex;
		}
	}

	createCTRInto(fullPath) {
		this.#validateCSV();

		this.CTRPath = fullPath;

		const CSVHeaderInfo = this.#findAllCSVHeader();

		this.#writeCTR(CSVHeaderInfo);
	}

	setCSVFolder(CSVPath) {
		this.CSVPath = CSVPath;
	}
}

module.exports = CTRGenerator;
