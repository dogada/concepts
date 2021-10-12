Feature("Homepage");

Scenario("check homepage content", ({ I }) => {
  I.amOnPage("/");
  I.seeTitleEquals("ConcepTS · concepts.com");
  I.seeInTitle("concepts.com");
  I.see("ConcepTS is a Concept Web Framework based on TypeScript", "h1");
  I.see("About", "a");
  I.see("ConcepTS, 2021", "footer");
});

Scenario("search", ({ I }) => {
  I.amOnPage("/");
  I.fillField("input[type=text]", "Test");
});

Scenario("can see login link", ({ I }) => {
  I.amOnPage("/");
  I.dontSee("Sign in");
  I.click("#accountMenu");
  I.see("Sign in");
});

Scenario.todo("can see and accept cookie banner", ({ I }) => {});
