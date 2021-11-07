module.exports.info = {
    name: 'play',
    cooldown: 2,
    section: 'music',
    description: 'Let\'s you play music! Heck, anything on Youtube.',
    usage: '<`prefix`>play'
};

const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { searchVideo } = require('usetube');
const play  = require('play-dl');
const { getBasicInfo } = require('ytdl-core');


module.exports.run = async (client, message, args) => {
    const video = await searchVideo(args.join(' '));
    if (video.videos.length === 0)message.reply('I\'m sorry but I couldn\'t find this video on youtube!');
    else message.reply({ content: video.didyoumean.length !== 0 ? "Did you mean " + video.didyoumean + "?" : "\u200b", components: [new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder('Result(s):').setCustomId(`play_menu_${message.author.id}_music`).addOptions(video.videos.map(item => { return { label: item.title, value: item.id, description: (item.artist.length === 0 ? sToF(item.duration) : sToF(item.duration) + ', by ' + item.artist)}}), { label: 'None of these!', value: 'none', emoji: '❌', description: 'Click to quit!'}))]});
}

module.exports.menu = async (client, interaction) => {
    if (interaction.values[0] === "none")interaction.update({embeds: [new MessageEmbed().setColor('RED').setTitle(':frowning2: Aw...')], components: []});
    else if(!interaction.member.voice.channel)interaction.update({embeds: [new MessageEmbed().setColor('RED').setDescription('You have to be in a voice channel to play a video!')]})
    else {
        const info = (await getBasicInfo(interaction.values[0], { lang: 'en'})).videoDetails;
        if (info.age_restricted)interaction.update({embeds: [new MessageEmbed().setColor('RED').setDescription('Sorry, but this video is NSFW')], components: []});
        else {
            let embedTitle = 'Added to Queue';
            if (client.queues.get(interaction.member.guild.id).length === 0)client.queues.set(interaction.member.guild.id, client.queues.get(interaction.member.guild.id).concat([info.video_url]));
            else {
                embedTitle = 'Started Playing';
                client.queues.set(interaction.member.guild.id, [info.video_url]);
                client.player = createAudioPlayer();
                const stream = await play.stream(info.video_url);
                client.player.play(createAudioResource(stream.stream, { inputType: stream.type}));
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.member.guild.id,
                    adapterCreator: interaction.member.guild.voiceAdapterCreator,
                });
                connection.subscribe(client.player);
                client.player.on('error', error => console.error(error));
                client.player.on(AudioPlayerStatus.Idle, async () => {
                    client.queues.get(interaction.member.guild.id).splice(0, 1);
                    if (client.queues.get(interaction.member.guild.id).length === 0) {
                        connection.destroy();
                        client.queues.delete(interaction.member.guild.id)
                        interaction.followUp({embeds: [new MessageEmbed().setColor('RED').setDescription('Queue is empty, leaving...')]})
                    } else {
                        const stream = await play.stream(client.queues.get(interaction.member.guild.id)[0]);
                        client.player.play(createAudioResource(stream.stream, { inputType: stream.type }));
                        interaction.followUp({embeds: [new MessageEmbed().setColor(client.randToastColor()).setDescription('Started playing next song.')]})
                    }
                });
            }
            await interaction.update({
                embeds: [new MessageEmbed().setColor('GREEN').setTitle(embedTitle).setDescription('**[' + info.title + '](' + info.video_url + ')**').setThumbnail(info.thumbnails[0].url).setAuthor('By ' + info.author.name + (info.author.verified ? ' \✔️' : ''), info.author.thumbnails[0].url, info.ownerProfileUrl).addFields({name: 'Likes', value: info.likes.toLocaleString('en-US'), inline: true}, {name: 'Dislikes', value: info.dislikes.toLocaleString('en-US'), inline: true}, {name: 'Views', value: parseInt(info.viewCount).toLocaleString('en-US'), inline: false}, {name: 'Track Length', value: sToF(info.lengthSeconds)})],
                components: []
            });
        }
    }
}

const sToF = (seconds) => (seconds >= 3600 ? Math.floor(seconds/3600) + ":" : "") + (Math.floor(seconds/60) - Math.floor(seconds/3600) * 60) + ':' + (seconds%60 < 10 ? '0' : '') + seconds%60;