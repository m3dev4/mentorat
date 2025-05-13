import { jest } from '@jest/globals';
import { getEnv } from '../../../../common/utils/get.env.js';

describe('getEnv', () => {
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

  test("devrait retourner la valeur de la variable d'environnement si elle existe", () => {
    // Arrange
    process.env.TEST_KEY = 'test_value';

    // Act
    const result = getEnv('TEST_KEY', 'default_value');

    // Assert
    expect(result).toBe('test_value');
  });

  test("devrait retourner la valeur par défaut si la variable d'environnement n'existe pas", () => {
    // Arrange
    // TEST_KEY2 n'existe pas dans process.env

    // Act
    const result = getEnv('TEST_KEY2', 'default_value');

    // Assert
    expect(result).toBe('default_value');
  });
});
