const { loginPage, I } = inject()

export = {
  goToHome: () => {
    I.amOnPage('https://github.com')
    loginPage.testMethod('From homePage')
  }
}
