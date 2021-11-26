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


module.exports.run = async (client, message, args) => {
    const video = await searchVideo(args.join(' '));
    if (video.videos.length === 0)message.reply('I\'m sorry but I couldn\'t find this video on youtube!');
    else message.reply({ content: video.didyoumean.length !== 0 ? "Did you mean " + video.didyoumean + "?" : "\u200b", components: [new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder('Result(s):').setCustomId(`play_menu_${message.author.id}_music`).addOptions(video.videos.map(item => { return { label: item.title, value: item.id, description: (item.artist.length === 0 ? sToF(item.duration) : sToF(item.duration) + ', by ' + item.artist)}}), { label: 'None of these!', value: 'none', emoji: '❌', description: 'Click to quit!'}))]});
}

module.exports.menu = async (client, interaction) => {
    if (interaction.values[0] === "none")interaction.update({embeds: [new MessageEmbed().setColor('RED').setTitle(':frowning2: Aw...')], components: []});
    else if(!interaction.member.voice.channel)interaction.update({embeds: [new MessageEmbed().setColor('RED').setDescription('You have to be in a voice channel to play a video!')]})
    else {
        const queue = client.queues.get(interaction.member.guild.id) || { queue: [], titles: []};
        const info = await client.createEmbed(interaction.values[0], interaction.user.id, queue);
        if (info[0]) {
            if (queue.queue.length !== 0)client.queues.set(interaction.member.guild.id, { loop: queue.loop, pos: queue.pos, queue: queue.queue.concat([info[2]]), titles: [queue.titles.concat([info[3]])]});
            else {
                client.queues.set(interaction.member.guild.id, { loop: queue.loop, pos: 0, queue: [info[2]], titles: [info[3]]});
                client.player = createAudioPlayer();
                const stream = await play.stream(info[2]);
                client.player.play(createAudioResource(stream.stream, { inputType: stream.type}));
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.member.guild.id,
                    adapterCreator: interaction.member.guild.voiceAdapterCreator,
                });
                connection.subscribe(client.player);
                client.player.on('error', error => console.error(error));
                client.player.on(AudioPlayerStatus.Idle, async () => {
                    let queue = client.queues.get(interaction.member.guild.id);
                    let embed = new MessageEmbed();
                    if (queue.queue.length-1 === queue.pos && !queue.loop) {
                        connection.destroy();
                        client.queues.set(interaction.member.guild.id, { loop: queue.loop, pos: 0, queue: [], titles: []});
                        embed.setColor('RED').setDescription('Queue is empty, leaving...');
                    } else {
                        queue = { loop: queue.loop, pos: queue.loop ? (queue.queue.length === queue.pos+1 ? 0 : queue.pos+1) : queue.pos+1, queue: queue.queue, titles: queue.titles};
                        client.queues.set(interaction.member.guild.id, queue);
                        embed = (await client.createEmbed(queue.queue[queue.pos], interaction.user.id, queue))[1];
                        const stream = await play.stream(queue.queue[queue.pos]);
                        client.player.play(createAudioResource(stream.stream, { inputType: stream.type }));
                    }
                    interaction.followUp({embeds: [embed]});
                });
            } 
        }
        await interaction.update({
            embeds: [info[1]],
            components: []
        });
    }
}

const sToF = (seconds) => (seconds >= 3600 ? Math.floor(seconds/3600) + ":" : "") + (Math.floor(seconds/60) - Math.floor(seconds/3600) * 60) + ':' + (seconds%60 < 10 ? '0' : '') + seconds%60;
