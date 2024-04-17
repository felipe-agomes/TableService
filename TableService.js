const fs = require('fs');
const { isRegExp } = require('util/types');

class TableService {
	#CSVPath;
	#CTRPath;
	#regexForTablename;
	#allTablename;

	constructor(CTRGenerator, BATGenerator, SQLGenerator) {
		this.CTRGenerator = CTRGenerator;
		this.BATGenerator = BATGenerator;
		this.SQLGenerator = SQLGenerator;
	}

	createTableSQLInto(fullPath) {
		this.#validate();

		this.SQLGenerator.setCSVFolder(this.#CSVPath);
		this.SQLGenerator.setRegexForTablename(this.#regexForTablename);

		return this.SQLGenerator.createTableSQLInto(fullPath);
	}

	#setAllTablename(allTablename) {
		this.#allTablename = allTablename;
	}

	getAllTablename() {
		return this.#allTablename;
	}

	createBATInto(fullPath) {
		if (!fullPath) {
			throw new Error(
				'Deve ser informado o caminho de onde vai ficar salvo os arquivos .bat',
			);
		}

		this.BATPath = fullPath;
		this.BATGenerator.setCTRFolder(this.#CTRPath);

		this.BATGenerator.createBATInto(fullPath);
	}

	createCTRInto(fullPath) {
		if (!fullPath) {
			throw new Error(
				'Deve ser informado o caminho de onde vai ficar salvo os arquivos .ctr',
			);
		}

		this.#CTRPath = fullPath;

		this.CTRGenerator.setCSVFolder(this.#CSVPath);

		this.CTRGenerator.createCTRInto(fullPath);
	}

	setCSVFolder(CSVPath) {
		this.#CSVPath = CSVPath;

		this.#setAllTablename(
			fs
				.readdirSync(this.#CSVPath)
				.map((csv) => csv.match(this.#regexForTablename)[1]),
		);
	}

	setCTRFolder(CTRPath) {
		this.#CTRPath = CTRPath;
	}

	#validate() {
		if (!isRegExp(this.#regexForTablename)) {
			throw new Error('Regex inválido ou indefinido');
		}
	}

	setRegexForTablename(regex) {
		this.#regexForTablename = regex;
		this.#validate();
		this.CTRGenerator.setRegexForTablename(regex);
	}
}

module.exports = TableService;
