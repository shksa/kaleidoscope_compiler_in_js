export const parseError = {
  unexpectedToken(token) {
    return new Error(`unexpected token ${token}`)
  }
}