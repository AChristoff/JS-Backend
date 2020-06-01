const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true
    },
    hashedPassword: {
        type: Schema.Types.String,
        required: true
    },
    role: {type: mongoose.Schema.Types.String},
    name: {
        type: Schema.Types.String,
        required: true
    },
    salt: {
        type: Schema.Types.String,
        required: true
    },
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

userSchema.method({
    authenticate: function (password) {
        const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

        return currentHashedPass === this.hashedPassword;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdmin = async () => {
    const users = await User.find();

    try {

        if (users.length > 0) {
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPassword = encryption.generateHashedPassword(salt, 'admin');

        return User.create({
            email: 'admin@mail.com',
            hashedPassword,
            role: 'Admin',
            name: 'Admin',
            salt,
            posts: []
        });
    } catch (e) {
        console.error(e);
    }
};

module.exports = User;
