const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

// create Factory
const makeSut = () => {
  return new EmailValidator()
}

describe('EMAIL VALIDATOR', () => {
  test('should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid@email.com')

    expect(isEmailValid).toBe(true)
  })

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid@email.com')

    expect(isEmailValid).toBe(false)
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@email.com')

    expect(validator.email).toBe('any_email@email.com')
  })
})
