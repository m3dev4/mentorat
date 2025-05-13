export default {
  type: 'module', //Indication que nous utilisons ESM
  testEnvironment: 'node', //Indication que nous utilisons le runtime node pour les tests
  testMatch: ['**/__test__/**/*.js', '**/?(*.)+(spec|test).js'], //Indication que les fichiers qui se terminent par .test.js sont des fichiers de test
  testPathIgnorePatterns: ['node_modules'], //Indication que les fichiers qui se trouvent dans node_modules ne seront pas testés
  collectCoverage: true, //Indication que nous voulons collecter les informations de couverture de test
  coverageDirectory: 'coverage', //Indication que les informations de couverture de test seront stockées dans le dossier coverage
  collectCoverageFrom: ['src/**/*.js'], //Indication que nous voulons collecter les informations de couverture de test pour tous les fichiers js dans le dossier src
  testTimeout: 10000, //Indication que les tests ne doivent pas être terminés avant 10 secondes
  transform: {},
};
