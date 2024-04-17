const { TableServiceCli } = require('./index');

const tableService = new TableServiceCli('asdf', 'asdf', 'asdf');

const table = tableService.getInstance();

// table.setCSVFolder('C:\\Users\\Felipe.admrh01\\Importacao\\Exportação');
// console.log(table.createTableSQL());

table.setRegexForTablename(/.*\.(.*)\..*/);

table.setCSVFolder('C:\\Users\\Felipe.admrh01\\Importacao\\Exportação');

// table.createCTRInto('C:\\Users\\Felipe.admrh01\\Importacao\\CONTROLLER');

// table.createBATInto('C:\\Users\\Felipe.admrh01\\Importacao\\BAT');

table.createTableSQLInto('C:\\Users\\Felipe.admrh01\\Importacao\\SQL');
