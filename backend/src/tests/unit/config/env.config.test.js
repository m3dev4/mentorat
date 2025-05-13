import { jest } from '@jest/globals';

// Mocker le module dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('envConfig', () => {
  // Sauvegarde l'environnement original
  const originalEnv = process.env;

  beforeEach(() => {
    // Réinitialise process.env avant chaque test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restaure l'environnement original après tous les tests
    process.env = originalEnv;
  });

  test('devrait utiliser les valeurs de process.env si elles existent', async () => {
    // Arrange
    process.env.NODE_ENV = 'test';
    process.env.PORT = '4000';
    
    // Act
    const { envConfig } = await import('../../../../src/config/env/env.config.js');
    
    // Assert
    expect(envConfig.NODE_ENV).toBe('test');
    expect(envConfig.PORT).toBe('4000');
  });

  test('devrait utiliser les valeurs par défaut si process.env n\'existe pas', async () => {
    // Arrange
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    
    // Act
    const { envConfig } = await import('../../../../src/config/env/env.config.js');
    
    // Assert
    expect(envConfig.NODE_ENV).toBe('development'); // Valeur par défaut attendue
    expect(envConfig.PORT).toBe(3000); // Valeur par défaut attendue
  });
});