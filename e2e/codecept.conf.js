require("ts-node/register");
const { setHeadlessWhen } = require("@codeceptjs/configure");
const { bootstrap } = require("./presettings.ts");

const TEST_URL = process.env.E2E_TEST_URL || "http://web:3000";
// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.E2E_HEADLESS);

exports.config = {
  tests: "./tests/**.ts",
  output: "./output",
  helpers: {
    Playwright: {
      url: TEST_URL,
      show: false,
      windowSize: "1200x900",
      browser: "chromium",
      ignoreHTTPSErrors: true,
    },
    CustomHelper: {
      require: "./CustomHelper.ts",
    },
  },
  bootstrap,
  include: {
    loginPage: "./loginPage.ts",
    homePage: "./homePage.ts",
  },
  name: "ConcepTS E2E tests",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
      retries: 1,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
