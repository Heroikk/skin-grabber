const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("render-3d")
        .setDescription("Render a 3D Version of a minecraft java skin.")
        .addStringOption((option) => {
            return option
                .setName("username")
                .setDescription("A minecraft java username or UUID.")
                .setRequired(true);
        }),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        let username = interaction.options.getString("username");

        let id = "";
        if (username.length === 32 || username.length === 36) {
            // if length is 32 or 36 then given string is an uuid
            id = username;
            const res = await axios.get(
                `https://api.mojang.com/user/profiles/${username}/names`
            );

            username = res.data[0].name;
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

        const render = `https://crafatar.com/renders/body/${id}`;
        const skinDl = `https://minotar.net/skin/${id}`;

        const emb = new MessageEmbed()
            .setTitle(`${username}'s 3D Render:`)
            .setImage(render)
            .setDescription(`[Download](${skinDl})`)
            .setFooter(client.user.username)
            .setColor("RANDOM")
            .setTimestamp();

        interaction.followUp({ embeds: [emb] });
    },
};
