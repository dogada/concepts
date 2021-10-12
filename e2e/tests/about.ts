Feature("About");

Scenario("Check Start Now", async ({ I }) => {
  I.amOnPage("/about");
  I.click("Start now");
  //loginPage.testMethod('From UI')
  I.dontSeeInTitle("About");
  I.seeInTitle("concepts");
});
