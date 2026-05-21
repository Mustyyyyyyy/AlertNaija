const http = require('http');
const data = JSON.stringify({
  fullName: "New User",
  email: "newuser@test.com",
  phone: "09011111111",
  password: "password123",
  role: "CITIZEN"
});
const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body.substring(0, 200)));
});
req.on('error', e => console.error('Error:', e.message));
req.write(data);
req.end();
