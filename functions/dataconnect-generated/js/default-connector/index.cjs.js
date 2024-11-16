const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'xlfc-functions',
  location: 'europe-west1'
};
exports.connectorConfig = connectorConfig;

