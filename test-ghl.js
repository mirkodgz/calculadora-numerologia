import fs from 'fs';

let apiKey = '';
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GHL_API_KEY=(.*)/);
  if (match) apiKey = match[1].trim();
} catch (e) {
  console.error('Error reading .env');
}

const email = 'mirkodgzguillen@gmail.com';

async function test() {
  console.log("Testing API with email:", email);
  try {
    const res1 = await fetch(`https://rest.gohighlevel.com/v1/contacts/?query=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });
    console.log("?query= Status:", res1.status);
    console.log("query data:", JSON.stringify(await res1.json(), null, 2));

    const res2 = await fetch(`https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });
    console.log("lookup Status:", res2.status);
    console.log("lookup data:", JSON.stringify(await res2.json(), null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
