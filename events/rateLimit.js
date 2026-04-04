const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
module.exports = (client) => {
    console.log("rate limit event loaded !");
    console.log("rate limit event loaded !");
    console.log("rate limit event loaded !");
    client.rest.on('rateLimited', (rateLimitData) => {
        console.log("🛑 Rate Limit : " + rateLimitData.timeToReset / 1000 + "s, Global : " + rateLimitData.global + ", Methode : " + rateLimitData.method);
        console.log('➡️ Rate limit data : ', rateLimitData);

        setTimeout(() => {
            console.log("🟢 Rate limit : Fin de la durée, reprise du bot");
            //Send message on moderation channel
        }, rateLimitData.timeToReset);
    });
}
