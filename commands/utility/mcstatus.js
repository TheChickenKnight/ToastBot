module.exports.info = {
    name: 'mcstatus',
    cooldown: 3,
    aliases: ['mcst'],
    section: 'utility',
    description: 'check the status of your favorite server!',
    usage: 'mcst/mcstatus <server ip>'
}

const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    if (!args[0])return message.reply('You have to include a server ip!');
    else {
        await fetch(`https://api.mcsrvstat.us/2/${args.join(' ')}`).then(res => res.json())
        .then(async res => {
            if (res.ip == "127.0.0.1") {
                return message.reply('That doesn\'t seem to be a valid server. Perhaps you spelled it wrong?')
            } else {
                var embed = new MessageEmbed();
                if (!res.online) embed
                    .setTitle((res.hostname || res.ip + res.port))
                    .setColor("RED")
                    .setDescription("❌ This server is currently offline!")
                    .setThumbnail('https://cdn.discordapp.com/attachments/834131042603499570/880999150068563968/favicon.png');
                else {
                    var image = new Image();
                    image.src = res.icon;
                    embed
                    .setThumbnail(image)
                    .setTitle(`${res.hostname || `${res.ip}:${res.port}`}(${res.version})`)
                    .setColor(client.randToastColor())
                    .setDescription(`**${res.motd.clean[Math.floor(Math.random() * res.motd.clean.length)]}**\n\`${res.players.online}\` out of \`${res.players.max}\` players are currently playing!`)
                    if (res.players.list)embed.addField("Players:", res.players.list.join('\n'));
                }
            }
            message.reply({embeds: [embed]});
        });
    }
}