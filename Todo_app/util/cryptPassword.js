const bcrypt = require('bcrypt-nodejs');

module.exports = function cryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                // Encrypt password using bycrpt module
                if (err) return reject(err);

                bcrypt.hash(password, salt, null, function (err, hash) {
                    if (err) return reject(err);
                    return resolve(hash);
                });
            });
        });
    }