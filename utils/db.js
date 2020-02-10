// here we will do all the SPICED GP setup:
const spicedPg = require('spiced-pg');
// process.env.MODE_ENV === "production" ? secrets = process.env : secrets = require('./secrets.json');

//process.env.MODE_ENV === "production" ? secrets = process.env : secrets = require('./secrets.json');
const pgUrl = process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/petitiondb';
const db = spicedPg(pgUrl);

// database queries:
module.exports.addSignature = function addSignature(signatureUrl, userId) {
    return db.query(
        `INSERT INTO signatures(signature, user_id)
         VALUES ($1, $2)
         RETURNING *;`, [signatureUrl, userId]
     );
}
module.exports.addUser = function addUser(firstName, lastName, email, password) {
    return db.query(
        `INSERT INTO users(first, last, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`, [firstName, lastName, email, password]
     );
}
module.exports.addUserProfile = function addUserProfile(age, city, homepage, userId) {
    return db.query(
        `INSERT INTO profile(age, city, url, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`, [age, city, homepage, userId]
     );
}
module.exports.getUserSignedCount = function getUserSignedCount() {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};
module.exports.getSignature = function getSignature(id) {
    return db.query(`SELECT signature FROM signatures WHERE id=$1`, [id]);
};
module.exports.getSigners = function getSigners() {
    return db.query(`SELECT first, last FROM users`);
};
module.exports.getPass = function getPass(email) {
    return db.query(`SELECT password FROM users WHERE email=$1`, [email]);
};
// module.exports.getUserId = function getUserId(email) {
//     return db.query(`SELECT id FROM users WHERE id=$1`, [email]);
// };
module.exports.user = function user(email) {
    return db.query(
        `SELECT email, password, city, age, url, first, last, signatures.signature, users.id AS user_id, signatures.id AS sign_id
        FROM users
        LEFT OUTER JOIN signatures ON users.id = signatures.user_id
        LEFT OUTER JOIN profile ON users.id = profile.user_id
        WHERE email=$1`,
        [email]
    );
};
module.exports.signers = function signers() {
    return db.query(
        `SELECT first, last, age, city, url
        FROM users
        JOIN signatures
        ON users.id = signatures.user_id
        LEFT JOIN profile
        ON profile.user_id = users.id;`);
};

module.exports.getSignersByCity = function getSignersByCity(city) {
    return db.query(
        `SELECT first, last, city, age, url
        FROM users
        JOIN signatures 
        ON users.id = signatures.user_id
        LEFT JOIN profile 
        ON profile.user_id = users.id
        WHERE LOWER(city) = LOWER($1);`,
        [city]
    );
};

module.exports.deleteSignature = function deleteSignature(userId) {
    return db.query(`DELETE FROM signatures WHERE user_id = $1`, [userId]);
}; 
module.exports.deleteAccount = function deleteAccount(userId) {
    return db.query(`DELETE FROM users WHERE id=$1`, [userId]);
};
module.exports.deleteUserProfile = function deleteUserProfile(userId) {
    return db.query(`DELETE FROM users WHERE user_id=$1`, [userId]);
};
