export const getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
};
