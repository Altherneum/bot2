const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
module.exports = (client) => {
    console.log("rate limit event loaded !");
    console.log("rate limit event loaded !");
    console.log("rate limit event loaded !");
    client.rest.on('rateLimited', (rateLimitData) => {
        console.log('Bot encountered a Rate Limit:', rateLimitData);
        // rateLimitData is an array of objects containing:
        // { timeToReset, limit, method, hash, url, route, majorParameter, global }
        
        // Example logic: Wait for the reset time
        if (rateLimitData && rateLimitData[0]) {
            const { timeToReset, route } = rateLimitData[0];
            console.log(`Rate limited on ${route}, waiting ${timeToReset}ms...`);
            
            setTimeout(() => {
            console.log('Retry attempt...');
            // Retry your logic here if needed
            }, timeToReset);
        }
    });
}
