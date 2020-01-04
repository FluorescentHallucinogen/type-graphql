module.exports = {
  verbose: false,
  collectCoverage: false,
  rootDir: "./",
  projects: ["<rootDir>/packages/*"],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-select-projects"],
};
