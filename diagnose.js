#!/usr/bin/env node

// Quick diagnostic script
console.log('🔍 Running Assessment API Diagnostics...\n');

import { existsSync } from 'fs';
import { join } from 'path';

const requiredFiles = [
    'src/config/express.js',
    'src/config/database.js', 
    'src/config/socket.js',
    'src/index.js',
    'package.json',
    '.env'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
    const exists = existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🔧 Environment variables:');
console.log(`PORT: ${process.env.PORT || '3000 (default)'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);

console.log('\n📦 Testing imports:');
try {
    await import('./src/config/express.js');
    console.log('✅ Express config import successful');
} catch (error) {
    console.log('❌ Express config import failed:', error.message);
}

try {
    await import('./src/config/database.js');
    console.log('✅ Database config import successful');
} catch (error) {
    console.log('❌ Database config import failed:', error.message);
}

try {
    await import('./src/config/socket.js');
    console.log('✅ Socket config import successful');
} catch (error) {
    console.log('❌ Socket config import failed:', error.message);
}

console.log('\n🎯 Diagnosis complete!');
