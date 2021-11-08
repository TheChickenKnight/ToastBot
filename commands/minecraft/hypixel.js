module.exports.info = {
    name: 'hypixel',
    cooldown: 3,
    aliases: ['hyp'],
    section: 'minecraft',
    description: 'check the status of your favorite server!',
    usage: 'mcst/mcstatus <server ip>'
};

const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const Hypixel = require('hypixel');
const hype = new Hypixel({ key: process.env.HYPIXEL_API });

module.exports.run = async (client, message, args) => {
    try {
        if (!args.length)message.reply({embeds: [new MessageEmbed().setColor('RED').setDescription('You need to include a player\'s name!')]});
        else hype.getPlayerByUsername(args[0], async (err, player) => {
            if (err)console.error(err);
            else if (player == null)message.reply({
                    embeds: [new MessageEmbed().setColor('RED').setTitle(args[0]).setImage('https://minecraft-api.com/api/skins/' + args[0] + '/body/-5.25').setDescription('We\'re not sure if this is a real person since they\'ve never been on hypixel. We\'ll try to fetch an image.')]
            });
            else message.reply({
                embeds: [new MessageEmbed().setColor('GREEN').setTitle((Object.keys(player).includes('displayname') ? player.displayname : player.playername) + ' ' + (!player.lastLogin ? '🟢 Online recently' : '🔴 Offline')).setFooter('Last joined Hypixel at').setTimestamp(player.lastLogin).addFields({ name: '\u200b', value: 'Currently has ' + player.achievementsOneTime.length + ' achievements.'}, { name: '\u200b', value: player.networkExp.toLocaleString() + ' network xp.'}).setImage('https://crafatar.com/renders/body/' + player.uuid + '?overlay=true')],
                components: [new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId(`hypixel_menu_${message.author.id}_minecraft`).addOptions(Object.keys(player.stats).map(item => ({ label: item.slice(0, 24), value: item.slice(0, 24)}))))]
            });
        });
    } catch {
        message.reply('This command is buggy, it seems to have errored!');
    } 
}

module.exports.menu = (client, interaction) => {
    
}