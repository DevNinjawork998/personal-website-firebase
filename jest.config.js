module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.js",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/reportWebVitals.ts",
    "!src/setupTests.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$|@chakra-ui|@emotion))"],
};
