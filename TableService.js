const { isRegExp } = require('util/types');

class TableService {
	CSVPath;
	CTRPath;

	constructor(CTRGenerator, BATGenerator) {
		this.CTRGenerator = CTRGenerator;
		this.BATGenerator = BATGenerator;
	}

	createBATInto(fullPath) {
		if (!fullPath) {
			throw new Error(
				'Deve ser informado o caminho de onde vai ficar salvo os arquivos .bat',
			);
		}

		this.BATPath = fullPath;
		this.BATGenerator.setBATFolder(fullPath);
		this.BATGenerator.setCTRFolder(this.CTRPath);

		this.BATGenerator.createBATInto(fullPath);
	}

	createCTRInto(fullPath) {
		if (!fullPath) {
			throw new Error(
				'Deve ser informado o caminho de onde vai ficar salvo os arquivos .ctr',
			);
		}

		this.CTRPath = fullPath;

		this.CTRGenerator.setCSVFolder(this.CSVPath);

		this.CTRGenerator.createCTRInto(fullPath);
	}

	setCSVFolder(CSVPath) {
		this.CSVPath = CSVPath;
	}

	setCTRFolder(CTRPath) {
		this.CTRPath = CTRPath;
	}

	setRegexForTablename(regex) {
		if (isRegExp(regex)) {
			this.CTRGenerator.setRegexForTablename(regex);
		}
	}
}

module.exports = TableService;
