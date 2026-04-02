const { REST, Routes, Events } = require('discord.js');
const { clientId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${file} is missing "data" or "execute"`);
            }
        }

        const rest = new REST({ version: '10' }).setToken(token);

        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // For guild-specific commands (instant update)
               /*  await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands }
                ); */

                // For global commands (takes up to 1 hour)
                await rest.put(Routes.applicationCommands(clientId), { body: commands });

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error('Error registering commands:', error);
            }
        })();
    },
};