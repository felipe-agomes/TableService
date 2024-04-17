const TableService = require('./TableService');

const tableService = new TableService(
	'RH_DADOS',
	't$rhd4d0s#2023',
	'PMSFP_HML',
);

tableService.setRegexForTablename(/.*\.(.*)\..*/);

tableService.setCSVFolder('C:\\Users\\Felipe.admrh01\\Importacao\\Exportação');

tableService.createCTRInto('C:\\Users\\Felipe.admrh01\\Importacao\\CONTROLLER');

tableService.createBATInto('C:\\Users\\Felipe.admrh01\\Importacao\\BAT');
