require('dotenv').config();

export default {
    name: 'simple-qr-scanner',
    version: '1.0.0',
    extra: {
        serverHost: process.env.HOST === '192.168.100.162'
    },
};