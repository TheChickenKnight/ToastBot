module.exports.info = {
    name: 'mcstatus',
    cooldown: 3,
    aliases: ['mcst'],
    section: 'minecraft',
    description: 'check the status of your favorite server!',
    usage: 'mcst/mcstatus <server ip>'
};

const { MessageEmbed, MessageAttachment, MessageActionRow, Message, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    if (!args[0] && !(await client.redis.HEXISTS(`guildSpec_${message.channel.guildId}`, 'default_mc_server')))client.error(message, 'You have to include a server ip!');
    else {
        fetch(`https://api.mcsrvstat.us/2/${args.length > 0 ? args.join(' ') : (await client.redis.HGET(`guildSpec_${message.channel.guildId}`, 'default_mc_server'))}`).then(res => res.json()).then(async res => {
            var file = new MessageAttachment('./Images/DefaultMinecraft.png');;
            if (res.ip == "127.0.0.1")return client.error(message, 'That doesn\'t seem to be a valid server. Perhaps you spelled it wrong?')
            else {
                var embed = new MessageEmbed().setTitle((res.hostname || `${res.ip}:${res.port}`) + (!(!res.version) ? `(${res.version})` : ' ')).setColor("RED").setDescription("❌ This server is currently offline!").setThumbnail('attachment://DefaultMinecraft.png');
                if (res.online) {
                    file = new MessageAttachment(new Buffer.from(res.icon.split(',')[1], 'base64'), 'img.png');
                    embed.setThumbnail('attachment://img.png').setColor('GREEN').setDescription(`**${res.motd.clean[Math.floor(Math.random() * res.motd.clean.length)]}**\n\`${res.players.online}\` out of \`${res.players.max}\` players are currently playing!`)
                    if (res.players.list)embed.addField("Players:", res.players.list.map((player, i) => `**${i+1}.** ${player.replace(/(?=_|\*|`|~|\||\\)/g, '\\')}`).join('\n'));
                }
            } 
            await message.reply({embeds: [embed], files: [file], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`mcstatus_${args.join(' ')}_all_minecraft`).setLabel('Make Default?').setStyle('SECONDARY').setDisabled(args.length == 0 || ((await client.redis.HGET(`guildSpec_${message.channel.guildId}`, 'default_mc_server')) && (await client.redis.HGET(`guildSpec_${message.channel.guildId}`, 'default_mc_server')) == args.join(' '))))]});
        });
    }
}

module.exports.button = (client, interaction) => client.redis.HSET(`guildSpec_${interaction.channel.guildId}`, 'default_mc_server', interaction.customId.split('_')[1]);