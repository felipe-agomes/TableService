const fs = require('fs');
const path = require('path');

class CSVService {
	static #findDelimiter(header) {
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

	static #validate(CSVPath) {
		if (!CSVPath) {
			throw new Error('Primeiro deve ser definido o caminho do CSV');
		}
	}

	static findAllCSVHeader(CSVPath, regexForTablename) {
		CSVService.#validate(CSVPath);

		const CSVHeaderInfo = [];
		const allCSVFilename = fs.readdirSync(CSVPath);
		const allCSVInfo = allCSVFilename.map((CSVFilename) => ({
			fullPath: path.join(CSVPath, CSVFilename),
			CSVFilename,
		}));

		for (const { fullPath, CSVFilename } of allCSVInfo) {
			const tablename = CSVFilename.match(regexForTablename)[1];

			const CSVFile = fs
				.readFileSync(fullPath, {
					encoding: 'utf-8',
				})
				.split('\r\n');

			if (CSVFile.length > 2) {
				const header = CSVFile[0];
				const delimiter = CSVService.#findDelimiter(header);
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
}

module.exports = CSVService;
