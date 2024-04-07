// async function generateKeyPair() {
//   try {
//       const keyPair = await window.crypto.subtle.generateKey(
//           {
//               name: "RSA-OAEP",
//               modulusLength: 2048,
//               publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
//               hash: "SHA-256",
//           },
//           true,
//           ["encrypt", "decrypt"]
//       );

//       const publicKey = await window.crypto.subtle.exportKey(
//           "spki",
//           keyPair.publicKey
//       );

//       const privateKey = await window.crypto.subtle.exportKey(
//           "pkcs8",
//           keyPair.privateKey
//       );

//       return { publicKey, privateKey };
//   } catch (error) {
//       console.error("Key generation failed:", error);
//       throw error;
//   }
// }
const crypto = require('crypto');

async function generateKeyPair() {
    try {
        // Generate RSA key pair
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicExponent: 65537,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        return { publicKey, privateKey };
    } catch (error) {
        console.error("Key generation failed:", error);
        throw error;
    }
}

  
  // Usage
  generateKeyPair()
    .then(({ publicKey, privateKey }) => {
      console.log("Public Key:", publicKey);
      console.log("Private Key:", privateKey);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  