const fs = require('fs');
const path = require('path');

class TableService {
	CSVPath;
	CTRPath;

	constructor(serverOutput) {
		this.serverOutput = serverOutput;
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
		const allCSVFullPath = allCSVFilename.map((CSVFilename) =>
			path.join(this.CSVPath, CSVFilename),
		);

		for (const CSVFullPath of allCSVFullPath) {
			const tableName = CSVFullPath.match(/.*\.(.*)\..*/)[1];

			const CSVFile = fs
				.readFileSync(CSVFullPath, {
					encoding: 'utf-8',
				})
				.split('\r\n');

			if (CSVFile.length > 2) {
				const header = CSVFile[0];
				const delimiter = this.#findDelimiter(header);
				const columns = header.split(delimiter).map((col) => col.trim());

				CSVHeaderInfo.push({
					CSVFullPath,
					tableName,
					delimiter,
					columns,
				});
			}
		}

		return CSVHeaderInfo;
	}

	#writeCTR({ CSVHeaderInfo, resultPath }) {
		for (const CSVHeader of CSVHeaderInfo) {
			const { originPath, tableName, delimiter, columns } = CSVHeader;

			const restult = `OPTIONS (SKIP=1)
load data
infile '${originPath}'
insert into table ${tableName}
fields terminated by '${delimiter}' OPTIONALLY ENCLOSED BY "'"
TRAILING NULLCOLS
(
	${columns.join(',\r\n   ')}
)`;
			const resultFullPath = path.join(resultPath, tableName + '.ctr');

			if (this.serverOutput) {
				console.log(restult);
			}

			fs.writeFileSync(resultFullPath, restult);
		}
	}

	#validateCSV() {
		if (!this.CSVPath) {
			throw new Error('Primeiro deve ser definido o caminho do CSV');
		}
	}

	#validateCTR() {
		if (!this.CTRPath) {
			throw new Error('Primeiro deve ser definido o caminho do CTR');
		}
	}

	#findAllCTRPath() {
		const allCTRFilename = fs.readdirSync(this.CTRPath);
		const allCTRFullPath = allCTRFilename.map((CTRFilename) =>
			path.join(this.CTRPath, CTRFilename),
		);
	}

	createCTRInto(fullPath) {
		this.#validateCSV();

		const CSVHeaderInfo = this.#findAllCSVHeader();

		this.#writeCTR({ CSVHeaderInfo, resultPath: fullPath });
	}

	#writeBAT(bat) {
		
	}

	createBatInto(fullPath) {
		this.#validateCTR();

		const bat = this.#findAllCTRPath();

		this.#writeBAT(bat);
	}

	setCSVFolder(CSVPath) {
		this.CSVPath = CSVPath;
	}

	setCTRFolder(CTRPath) {
		this.CTRPath = CTRPath;
	}
}

module.exports = TableService;
