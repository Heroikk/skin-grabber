const client = require("../index");
const { bot_id: id } = require("../config.json");
const { MessageEmbed } = require("discord.js");

client.on("messageCreate", (msg) => {
    if (msg.content === `<@${id}>` || msg.content === `<@!${id}>`) {
        const clientUsername = client.user.username;
        const invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274877926400&scope=applications.commands%20bot`;

        const emb = new MessageEmbed()
            .setTitle(clientUsername)
            .setDescription(
                `${clientUsername} has migrated to **Slash Commands**
                Normal commands have been removed.
                Type **/** to view ${clientUsername} commands
                
                :warning: **To enable Slash Commands, Kick and Re-invite ${clientUsername} by clicking [here](${invite})**`
            )
            .setColor("RANDOM")
            .setThumbnail(client.user.avatarURL())
            .setTimestamp();

        msg.reply({ embeds: [emb] });
    }
});
