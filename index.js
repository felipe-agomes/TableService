const TableService = require('./TableService');

const tableService = new TableService(false);

// tableService.setCSVFolder('C:\\Users\\Felipe.admrh01\\Importacao\\Exportação');

// tableService.createCTRInto('C:\\Users\\Felipe.admrh01\\Importacao\\CONTROLLER');
tableService.setCTRFolder('C:\\Users\\Felipe.admrh01\\Importacao\\CONTROLLER');

tableService.createBatInto('C:\\Users\\Felipe.admrh01\\Importacao\\BAT');
