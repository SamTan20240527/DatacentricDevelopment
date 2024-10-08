//node generateTokenSecret.js
//Copy the token and put in .env: TOKEN_SECRET=
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
