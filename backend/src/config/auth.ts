export default {
  jwt: {
    secretKey: process.env.APP_SECRET,
    expiresIn: '7d'
  }
}