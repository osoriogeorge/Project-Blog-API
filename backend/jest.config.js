/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  forceExit: true, // Asegura que Jest se cierre después de las pruebas
  clearMocks: true, // Limpia los mocks entre las pruebas
};
