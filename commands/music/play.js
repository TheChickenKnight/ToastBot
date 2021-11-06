module.exports.info = {
    name: 'play',
    cooldown: 2,
    section: 'music',
    description: 'Let\'s you play music! Heck, anything on Youtube.',
    usage: '<`prefix`>play'
};

const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { searchVideo } = require('usetube');

module.exports.run = async (client, message, args) => {
    const video = await searchVideo(args.join(' '));
    if (video.videos.length === 0)message.reply('I\'m sorry but I couldn\'t find this video on youtube!');
    else message.reply({ 
        content: video.didyoumean.length !== 0 ? "Did you mean " + video.didyoumean + "?" : "\u200b",
        components: [new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder('Result(s):').setCustomId(`play_menu_${message.author.id}_music`).addOptions(video.videos.map(item => { return { label: item.title, value: item.id, description: (item.artist.length === 0 ? sToF(item.duration) : sToF(item.duration) + ', by ' + item.artist)}}), { label: 'None of these!', value: 'none', emoji: '❌', description: 'Click to quit!'}))]
    });
}

module.exports.menu = (client, interaction) => {
    if (interaction.values[0] === "none")interaction.update({embeds: [new MessageEmbed().setColor('RED').setTitle(':frowning2: Aw...')], components: []})
    else {
        interaction.update('Nothing here yet!');
    }
}

const sToF = (seconds) =>  {
    return (seconds > 360 ? Math.floor(seconds/360) + ":" : "") + Math.floor(seconds/60) + ':' + ((seconds%60 + "").length === 1 ? "0" + seconds%60 : seconds%60);
}