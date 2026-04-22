
const crypto = require('crypto');
const pin = '140433';
const hash = crypto.createHash('sha256').update(pin).digest('hex');
console.log('PIN:', pin);
console.log('SHA-256 Hash:', hash);
