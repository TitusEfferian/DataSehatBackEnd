const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nem = require("nem-sdk").default;

// User Schema
const UserSchema = mongoose.Schema({
    ktp: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    secret: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = (newUser, callback) => {
    var rBytes = nem.crypto.nacl.randomBytes(32);
    var rHex = nem.utils.convert.ua2hex(rBytes);
    var keyPair = nem.crypto.keyPair.create(rHex);
    var address = nem.model.address.toAddress(keyPair.publicKey.toString(), nem.model.network.data.testnet.id)
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.address = address;
            newUser.secret = rHex;
            newUser.password = hash;
            newUser.save(callback);
        });
    })
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.getUserByKTP = (ktp, callback) => {
    User.findOne({ktp: ktp}, callback);
}

module.exports.getUserInfo = () => {

}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}
