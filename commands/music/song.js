module.exports.info = {
    name: 'song',
    cooldown: 3,
    section: 'music',
    description: 'looks up music!',
    usage: 'music <song name>'
}

const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = (client, message, args) => {
    if (!args[0])return message.reply({content: 'You have to mention some song name!'});
    var embed = new MessageEmbed().setColor(client.randToastColor()), row = new MessageActionRow();
    fetch(`https://api.genius.com/search?access_token=${process.env.GENIUS_TOKEN}&q=${args.join(' ')}`).then(res => res.json()).then(res => {
        if (res.response.hits.length == 0)embed.setDescription('ERROR! No songs match this title! Are you sure you spelled it right?').setColor('RED');
        else if (res.response.hits.length == 1) {
            embed
                .setTitle('Did you mean:')
                .setAuthor("By " + res.response.hits[0].result.primary_artist.name, res.response.hits[0].result.primary_artist.image_url, res.response.hits[0].result.primary_artist.url)
                .setThumbnail(res.response.hits[0].result.song_art_image_url)
                .setDescription(`**[${res.response.hits[0].result.title_with_featured}](${res.response.hits[0].result.url})**`);
            row.addComponents(
                new MessageButton()
                    .setCustomId(`song_yes_${message.author.id}_music`)
                    .setLabel('✔️')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId(`song_no_${message.author.id}_music`)
                    .setLabel('❌')
                    .setStyle('DANGER'),
            )
        } else {
            var menu = new MessageSelectMenu().setPlaceholder('Click me!').setCustomId(`song_menu_${message.author.id}_music`);
            embed
                .setTitle("Multiple Results:")
                .setDescription("Pick one from the menu, or decline if it's not there.\nClick if you're not sure, they give more info!")
                .setFooter('You\'re probably not specific enough if it\'s not there!');
            if (res.response.hits.length > 10)res.response.hits.length = 10;
            res.response.hits.forEach(song => menu.addOptions({label: song.result.title_with_featured, description: 'by ' + song.result.primary_artist.name, value: song.result.api_path, emoji: '▶️'}));
            menu.addOptions({label: 'None of these!', value: 'decline', emoji: '❌'});
            row.addComponents(menu);
        }
        message.reply({embeds: [embed], components: [row]});
    });
}

module.exports.menu = (client, interaction) => {
    var embed = new MessageEmbed().setColor(client.randToastColor())
    if (interaction.values[0] == 'decline')return interaction.update({embeds: [embed.setTitle('Multiple Results:').setDescription('aight.').setFooter('')], components: []});
    //fetch('https://api.genius.com/' + interaction.values[0] + '')
}