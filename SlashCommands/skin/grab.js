const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios')

module.exports = {
    ...new SlashCommandBuilder()
        .setName("grab")
        .setDescription(
            "Grab a java minecraft skin. (Bedrock not supported yet)"
        )
        .addStringOption((option) => {
            return option
                .setName("minecraft_username")
                .setDescription(
                    "A java minecraft username or UUID (Bedrock not yet supported)"
                )
                .setRequired(true);
        })
        .addBooleanOption((option) => {
            return option.setName("bust").setDescription("If you prefer the bust.");
        }),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        let username = interaction.options.getString("minecraft_username");
        const isBust = interaction.options.getBoolean("bust");

        let id = "";
        if (username.length >= 16) {
            // if length >= 16 then given string is an uuid
            id = username;
            const res = await axios.get(`https://api.mojang.com/user/profiles/${username}/names`)

            username = res.data[0].name

        } else if (username.length <= 16) {
            // else if length less then 16 its an username
            const res = await axios.get(
                `https://api.mojang.com/users/profiles/minecraft/${username}`
            );
            const data = await res.data;

            id = data.id;
        } else {
            // else invalid string
            let type;

            type = username.length <= 16 || username.length < 32 ? "Username" : "UUID";

            const lenDiff = username.length < 32 && username.length > 16
                ? "shorter then 16 characters"
                : "32 or 36 characters long";

            const emb = new MessageEmbed()
                .setTitle(`:warning: Invalid ${type}`)
                .setDescription(`${type} must be **${lenDiff}**`);

            return interaction.followUp({ embeds: [emb] });
        }

        const skin = isBust
            ? `https://minotar.net/bust/${id}/100.png`
            : `https://minotar.net/body/${id}/100.png`;
        const skinDl = `https://minotar.net/skin/${id}`;

        const emb = new MessageEmbed()
            .setTitle(`${username}'s skin:`)
            .setImage(skin)
            .setDescription(`[Download](${skinDl})`)
            .setFooter(client.user.username)
            .setColor('RANDOM')
            .setTimestamp();

        interaction.followUp({ embeds: [emb] });
    },
};
