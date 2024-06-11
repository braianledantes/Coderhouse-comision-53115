const hashing = require("../utils/hashing")

const userAdmin = {
    _id: "60f1b9e3b3f1f83f4c3f1f83", // un id random
    firstName: "Admin",
    lastName: "Admin",
    age: 18,
    email: "adminCoder@coder.com",
    password: hashing.hashPassword("adminCod3r123"),
    role: "admin",
    cart: { _id: "60f1b9e3b3f1f83f4c3f1f83" } // este carrito no existe
}

module.exports = {
    userAdmin,
    isAdmin: (obj) => obj == userAdmin.email || obj == userAdmin._id
}