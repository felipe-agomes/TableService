const CTRGenerator = require('./CRTGenerator');
const BATGenerator = require('./BATGenerator');
const TableService = require('./TableService');

class TableServiceCli {
	#TableService;
	constructor(DBuser, DBPassword, DBTns) {
		this.#TableService = new TableService(
			new CTRGenerator(),
			new BATGenerator(DBuser, DBPassword, DBTns),
		);
	}

	getInstance() {
		return this.#TableService;
	}
}

module.exports = { TableServiceCli };
