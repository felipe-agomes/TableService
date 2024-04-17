const CSVService = require('./CSVService');
const fs = require('fs');
const path = require('path');

class SQLGenerator {
	#CSVPath;
	#regexForTablename;

	setRegexForTablename(regex) {
		this.#regexForTablename = regex;
	}

	setCSVFolder(CSVPath) {
		this.#CSVPath = CSVPath;
	}

	#validate() {
		if (!this.#CSVPath) {
			throw new Error('Primeiro deve ser definido o caminho do CSV');
		}
	}

	createTableSQLInto(fullPath) {
		this.#validate();

		const CSVHeaderInfo = CSVService.findAllCSVHeader(
			this.#CSVPath,
			this.#regexForTablename,
		);

		let sql = '';
		for (const { tablename, columns } of CSVHeaderInfo) {
			sql += `CREATE TABLE ${tablename} (
	 ${columns.join(' VARCHAR2(4000)\n	,')} VARCHAR2(4000)	
);\n\n`;
		}

		fs.writeFileSync(path.join(fullPath, 'CREATE_TABLE.SQL'), sql);
	}
}

module.exports = SQLGenerator;
