class CustomHelper extends Helper {
  constructor(config: any) {
    super(config)
    this.helpers
  }
  log(...args: any[]) {
    console.log(...args)
  }

  printHelpers() {
    console.log('Helpers enabled', Object.keys(this.helpers))
  }
}

export = CustomHelper
