const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get bot latency."),        

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const emb = new MessageEmbed().setTitle(`${Math.round(client.ws.ping)}ms :ping_pong:`)

        interaction.reply({ embeds: [ emb ]})
    },
};
