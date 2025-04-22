import crypto from 'crypto';

// Generate a random 32-byte hex string
const secret = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT Secret:', secret); 