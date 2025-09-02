/**
 * Script to generate Farcaster Mini App signature
 * 
 * Usage:
 * 1. Install ethers: npm install ethers
 * 2. Update DOMAIN and PRIVATE_KEY below
 * 3. Run: node scripts/generate-farcaster-signature.js
 */

const { ethers } = require('ethers');

// CONFIGURATION - UPDATE THESE VALUES
const DOMAIN = "mininardchat.vercel.app"; // Replace with your actual domain
const PRIVATE_KEY = "0x..."; // Replace with your private key
const FID = 12345; // Replace with your Farcaster ID

async function generateSignature() {
  try {
    console.log('🚀 Generating Farcaster Mini App signature...\n');
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const publicKey = wallet.address;
    
    console.log(`📝 Domain: ${DOMAIN}`);
    console.log(`🔑 Public Key: ${publicKey}`);
    console.log(`👤 FID: ${FID}\n`);
    
    // Create payload
    const domainPayload = { domain: DOMAIN };
    const payloadString = JSON.stringify(domainPayload);
    const payload = Buffer.from(payloadString).toString('base64');
    
    console.log(`📦 Payload: ${payload}`);
    
    // Generate signature
    const message = payload;
    const signature = await wallet.signMessage(message);
    
    console.log(`✍️ Signature: ${signature}\n`);
    
    // Generate the complete manifest
    const manifest = {
      accountAssociation: {
        header: {
          fid: FID,
          type: "custody",
          key: publicKey
        },
        payload: payload,
        signature: signature
      },
      frame: {
        version: "1",
        name: "Nard.chat",
        iconUrl: "https://nard-chat.onrender.com/assets/nard-chat-logo.png",
        homeUrl: `https://${DOMAIN}`,
        imageUrl: `https://${DOMAIN}/nard-preview.png`,
        buttonTitle: "Open Nard.chat",
        splashImageUrl: "https://nard-chat.onrender.com/assets/nard-chat-logo.png",
        splashBackgroundColor: "#1a1a1a"
      }
    };
    
    console.log('✅ Complete manifest:');
    console.log(JSON.stringify(manifest, null, 2));
    
    console.log('\n📋 Next steps:');
    console.log('1. Copy the manifest above');
    console.log('2. Replace content in public/.well-known/farcaster.json');
    console.log('3. Update app/.well-known/farcaster.json/route.ts');
    console.log('4. Deploy your app');
    console.log('5. Test /.well-known/farcaster.json endpoint');
    
  } catch (error) {
    console.error('❌ Error generating signature:', error);
  }
}

// Validation
if (DOMAIN === "your-domain.com") {
  console.error('❌ Please update DOMAIN in the script');
  process.exit(1);
}

if (PRIVATE_KEY === "0x...") {
  console.error('❌ Please update PRIVATE_KEY in the script');
  process.exit(1);
}

if (FID === 12345) {
  console.error('❌ Please update FID in the script');
  process.exit(1);
}

generateSignature();