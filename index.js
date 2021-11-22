const { Client, Collection, Intents } = require("discord.js");
require('dotenv').config()

const intents = new Intents();

intents.add('GUILDS')
intents.add('GUILD_MESSAGES')

const client = new Client({intents});
module.exports = client;

// Global Variables
client.slashCommands = new Collection();

// Initializing the project
require("./handler")(client);

client.login(process.env.TOKEN);