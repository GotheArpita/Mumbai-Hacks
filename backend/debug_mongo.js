require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('URI Type:', typeof uri);
if (!uri) {
    console.log('URI is undefined or empty');
} else {
    console.log('URI Length:', uri.length);
    // Mask the password for safety in logs
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Masked URI:', maskedUri);

    try {
        // Try to parse the connection string manually to see what it thinks the host is
        // Basic parsing logic for mongodb+srv://
        if (uri.startsWith('mongodb+srv://')) {
            const parts = uri.split('@');
            if (parts.length > 1) {
                const hostPart = parts[parts.length - 1];
                console.log('Host part detected:', hostPart.split('/')[0]);
            } else {
                console.log('Could not split by @, invalid format?');
            }
        }
    } catch (e) {
        console.log('Parsing error:', e.message);
    }
}

mongoose.connect(uri)
    .then(() => {
        console.log('Connected successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
