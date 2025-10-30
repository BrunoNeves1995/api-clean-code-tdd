module.exports = {
  isEmailValid: true,
  email: '',

  isEmail (newEmail) {
    this.email = newEmail
    return this.isEmailValid
  }
}
