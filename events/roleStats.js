const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configGlobal = require('../config.json');
const serverId = configGlobal.guildId;
const config = require("../configuration/" + serverId + "/periodicReport.json");

const delay = config.reportIntervalMinutes * 60 * 1000; // Replace with your Category ID

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      // Check if report interval is set in configuration
        console.log(`Starting periodic reports every ${config.reportIntervalMinutes} minutes...`);

        // Set up the timer for periodic reports & send one
        setInterval(async () => { await send(config, client, serverId); }, delay); 
        await send(config, client, serverId);

    } catch (error) {
      console.error('Error in client ready event:', error.message);
      process.exit(1); // Exit if there's a critical error
    }

    async function send(config, client, serverId){
        try {
            const { sendStatisticsEmbed } = require('../utils/roleStats');
            await sendStatisticsEmbed(config, client, serverId);
            console.log('Periodic report sent successfully');
          } catch (error) {
            console.error('Error sending periodic report:', error.message);
          }
    }
  },
};