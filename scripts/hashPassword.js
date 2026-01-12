import bcrypt from 'bcryptjs';

// Hash the password 'admin123'
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password Hash for admin123:');
console.log(hash);
console.log('\nUpdate the schema.sql file with this hash');
