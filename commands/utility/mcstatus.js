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
        fetch(`https://api.mcsrvstat.us/2/${args.join(' ')}`).then(res => res.json()).then(res => {
            var file = new MessageAttachment('./Images/DefaultMinecraft.png');;
            if (res.ip == "127.0.0.1")return message.reply('That doesn\'t seem to be a valid server. Perhaps you spelled it wrong?')
            else {
                var embed = new MessageEmbed().setTitle((res.hostname || `${res.ip}:${res.port}`) + (!(!res.version) ? `(${res.version})` : ' ')).setColor("RED").setDescription("❌ This server is currently offline!").setThumbnail('attachment://DefaultMinecraft.png');
                if (res.online) {
                    file = new MessageAttachment(new Buffer.from(res.icon.split(',')[1], 'base64'), 'img.png');
                    embed.setThumbnail('attachment://img.png').setColor(client.randToastColor()).setDescription(`**${res.motd.clean[Math.floor(Math.random() * res.motd.clean.length)]}**\n\`${res.players.online}\` out of \`${res.players.max}\` players are currently playing!`)
                    if (res.players.list)embed.addField("Players:", res.players.list.join('\n'));
                }
            } 
            message.reply({embeds: [embed], files: [file]});
        });
    }
}