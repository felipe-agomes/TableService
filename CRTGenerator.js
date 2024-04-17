const fs = require('fs');
const path = require('path');
const { isRegExp } = require('util/types');
const CSVService = require('./CSVService');

class CTRGenerator {
	#CSVPath;
	#CTRPath;
	#regexForTablename;

	#validate() {
		if (!this.#regexForTablename) {
			throw new Error(
				'Primeiro deve ser definido um regex para resolver o nome das tabelas',
			);
		}
	}

	#writeCTR(allCSVHeaderInfo) {
		for (const {
			originPath,
			tablename,
			delimiter,
			columns,
		} of allCSVHeaderInfo) {
			const ctr = `OPTIONS (SKIP=1)
load data
infile '${originPath}'
insert into table ${tablename}
fields terminated by '${delimiter}' OPTIONALLY ENCLOSED BY "'"
TRAILING NULLCOLS
(
	${columns.join(',\r\n	')}
)`;
			const CTRFullPath = path.join(this.#CTRPath, tablename + '.ctr');

			fs.writeFileSync(CTRFullPath, ctr);
		}
	}

	setRegexForTablename(regex) {
		if (isRegExp(regex)) {
			this.#regexForTablename = regex;
		}
	}

	createCTRInto(fullPath) {
		this.#validate();

		this.#CTRPath = fullPath;

		const CSVHeaderInfo = CSVService.findAllCSVHeader(
			this.#CSVPath,
			this.#regexForTablename,
		);

		this.#writeCTR(CSVHeaderInfo);
	}

	setCSVFolder(CSVPath) {
		this.#CSVPath = CSVPath;
	}
}

module.exports = CTRGenerator;
