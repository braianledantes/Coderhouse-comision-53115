const adminEmail = "adminCoder@coder.com"
const adminPass = "adminCod3r123"

module.exports = {
    userAdmin: {
        firstName: "Admin",
        lastName: "Admin",
        age: 18,
        email: adminEmail
    },
    validateLogin: (email, password) => email == adminEmail && password == adminPass,
    isAdmin: (email) => email == adminEmail
}