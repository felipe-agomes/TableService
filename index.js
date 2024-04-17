const CTRGenerator = require('./CRTGenerator');
const BATGenerator = require('./BATGenerator');
const TableService = require('./TableService');
const SQLGenerator = require('./SQLGenerator');

class TableServiceCli {
	#TableService;
	constructor(DBuser, DBPassword, DBTns) {
		this.#TableService = new TableService(
			new CTRGenerator(),
			new BATGenerator(DBuser, DBPassword, DBTns),
			new SQLGenerator(),
		);
	}

	getInstance() {
		return this.#TableService;
	}
}

module.exports = { TableServiceCli };
