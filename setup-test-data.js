#!/usr/bin/env node

/**
 * Socket.IO Test Data Setup Script
 * This script will create test users and provide data for Socket.IO testing
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Test users data
const testUsers = [
  {
    firstName: "Alice",
    lastName: "Johnson", 
    email: "alice@test.com",
    password: "password123"
  },
  {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@test.com", 
    password: "password123"
  },
  {
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@test.com",
    password: "password123"
  }
];

// Store created users and tokens
let createdUsers = [];

async function setupTestData() {
  console.log('🚀 Setting up Socket.IO test data...\n');

  try {
    // 1. Register test users
    console.log('👥 Registering test users...');
    for (const user of testUsers) {
      try {
        const response = await axios.post(`${BASE_URL}/register`, user);
        console.log(`✅ Registered: ${user.firstName} ${user.lastName} (${user.email})`);
        
        // Login to get token and user ID
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
          email: user.email,
          password: user.password
        });
        
        createdUsers.push({
          ...user,
          userId: loginResponse.data.data.user._id,
          token: loginResponse.data.data.token,
          name: `${user.firstName} ${user.lastName}`
        });
        
        console.log(`🔑 Token generated for ${user.firstName}`);
        
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User ${user.email} already exists, attempting login...`);
          
          // Try to login existing user
          const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: user.email,
            password: user.password
          });
          
          createdUsers.push({
            ...user,
            userId: loginResponse.data.data.user._id,
            token: loginResponse.data.data.token,
            name: `${user.firstName} ${user.lastName}`
          });
          
          console.log(`✅ Logged in existing user: ${user.firstName}`);
        } else {
          console.error(`❌ Failed to register ${user.email}:`, error.response?.data?.message || error.message);
        }
      }
    }

    console.log('\n📋 Test Data Summary:');
    console.log('==========================================');
    
    createdUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   User ID: ${user.userId}`);
      console.log(`   JWT Token: ${user.token.substring(0, 20)}...`);
    });

    // 2. Generate Socket.IO test scenarios
    console.log('\n\n🧪 Socket.IO Test Scenarios:');
    console.log('==========================================');
    
    if (createdUsers.length >= 2) {
      const alice = createdUsers.find(u => u.firstName === 'Alice');
      const bob = createdUsers.find(u => u.firstName === 'Bob');
      const charlie = createdUsers.find(u => u.firstName === 'Charlie');

      console.log('\n📨 Message Test (Alice → Bob):');
      console.log('```javascript');
      console.log('socket.emit("send_message", {');
      console.log(`  receiverId: "${bob.userId}",`);
      console.log('  content: "Hello Bob! This is a test message from Alice",');
      console.log('  type: "text"');
      console.log('});');
      console.log('```');

      console.log('\n📞 Call Test (Alice → Bob):');
      console.log('```javascript');
      console.log('socket.emit("start_call", {');
      console.log(`  receiverId: "${bob.userId}",`);
      console.log('  type: "voice"');
      console.log('});');
      console.log('```');

      if (charlie) {
        console.log('\n👥 Group Test (Alice → Charlie):');
        console.log('```javascript');
        console.log('socket.emit("send_message", {');
        console.log(`  receiverId: "${charlie.userId}",`);
        console.log('  content: "Hey Charlie! Ready for testing?",');
        console.log('  type: "text"');
        console.log('});');
        console.log('```');
      }

      console.log('\n⌨️  Typing Test (Alice → Bob):');
      console.log('```javascript');
      console.log('socket.emit("typing", {');
      console.log(`  receiverId: "${bob.userId}"`);
      console.log('});');
      console.log('```');
    }

    // 3. Generate HTML test data
    console.log('\n\n📄 HTML Test Client Data:');
    console.log('==========================================');
    console.log('Copy these values to the HTML test client:');
    
    createdUsers.forEach((user, index) => {
      console.log(`\n${user.name}:`);
      console.log(`JWT Token: ${user.token}`);
      console.log(`User ID: ${user.userId}`);
      if (index === 0 && createdUsers.length > 1) {
        console.log(`Send messages to: ${createdUsers[1].userId} (${createdUsers[1].name})`);
      }
    });

    // 4. Create test wallets
    console.log('\n\n💰 Creating test wallets...');
    for (const user of createdUsers) {
      try {
        await axios.post(`${BASE_URL}/wallet/create`, {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        console.log(`✅ Wallet created for ${user.name}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  Wallet already exists for ${user.name}`);
        } else {
          console.log(`❌ Failed to create wallet for ${user.name}`);
        }
      }
    }

    // 5. Generate cURL commands for REST API testing
    console.log('\n\n🌐 REST API Test Commands:');
    console.log('==========================================');
    
    if (createdUsers.length >= 2) {
      const alice = createdUsers[0];
      const bob = createdUsers[1];

      console.log('\n📨 Send Message via REST:');
      console.log(`curl -X POST ${BASE_URL}/messages/send \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -H "Authorization: Bearer ${alice.token}" \\`);
      console.log(`  -d '{`);
      console.log(`    "receiverId": "${bob.userId}",`);
      console.log(`    "content": "Hello from REST API!",`);
      console.log(`    "type": "text"`);
      console.log(`  }'`);

      console.log('\n📞 Start Call via REST:');
      console.log(`curl -X POST ${BASE_URL}/call/start \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -H "Authorization: Bearer ${alice.token}" \\`);
      console.log(`  -d '{`);
      console.log(`    "receiverId": "${bob.userId}",`);
      console.log(`    "type": "voice"`);
      console.log(`  }'`);

      console.log('\n💰 Transfer Funds via REST:');
      console.log(`curl -X POST ${BASE_URL}/wallet/transfer \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -H "Authorization: Bearer ${alice.token}" \\`);
      console.log(`  -d '{`);
      console.log(`    "recipientId": "${bob.userId}",`);
      console.log(`    "amount": 25.50,`);
      console.log(`    "currency": "USD"`);
      console.log(`  }'`);
    }

    console.log('\n\n🎉 Test data setup complete!');
    console.log('📝 Next steps:');
    console.log('1. Start the Socket.IO server: npm run dev');
    console.log('2. Open socketio-test-client.html in browser');
    console.log('3. Use the JWT tokens above to connect');
    console.log('4. Test real-time messaging and calls');
    console.log('5. Use the cURL commands to test REST API');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run dev');
      console.log('   or');
      console.log('   node src/index.js');
    }
  }
}

// Run the setup
setupTestData();
