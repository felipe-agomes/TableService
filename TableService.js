const fs = require('fs');
const path = require('path');
const { isRegExp } = require('util/types');
const CTRGenerator = require('./CRTGenerator');
const BATGenerator = require('./BATGenerator');

class TableService {
	CSVPath;
	CTRPath;

	constructor(DBuser, DBPassword, DBTns) {
		if (!DBuser || !DBPassword || !DBTns) {
			throw new Error('Devem ser definidas as credenciais para acesso ao banco');
		}

		this.CTRGenerator = new CTRGenerator();
		this.BATGenerator = new BATGenerator(DBuser, DBPassword, DBTns);

		this.DBTns = DBTns;
		this.DBPassword = DBPassword;
		this.DBuser = DBuser;
	}

	createBATInto(fullPath) {
		this.BATPath = fullPath;
		this.BATGenerator.setBATPath(fullPath);
		this.BATGenerator.setCTRFolder(this.CTRPath);

		this.BATGenerator.createBATInto(fullPath);
	}

	createCTRInto(fullPath) {
		this.CTRPath = fullPath;

		this.CTRGenerator.createCTRInto(fullPath);
	}

	setCSVFolder(CSVPath) {
		this.CSVPath = CSVPath;
		this.CTRGenerator.setCSVFolder(CSVPath);
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
