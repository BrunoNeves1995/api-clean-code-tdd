class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('EMAIL VALIDATOR', () => {
  test('should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid@email.com')
    expect(isEmailValid).toBe(true)
  })
})
