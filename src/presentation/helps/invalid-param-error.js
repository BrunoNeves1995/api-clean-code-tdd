module.exports = class InvalidParamError extends Error {
  constructor (paramName) {
    super(`Invlid param: ${paramName}`)
    this.name = 'InvlidParamError'
  }
}
