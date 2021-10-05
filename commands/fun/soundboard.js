module.exports.info = {
    name: 'soundboard',
    cooldown: 3,
    section: 'fun',
    description: 'make sound yes.',
    usage: 'soundboard'
};

const { 
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton, Collection } = require('discord.js');
const db = require('quick.db');

const addButton = new MessageButton()
    .setStyle('PRIMARY')
    .setLabel('Add an Effect');
const removeButton = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Remove selected Effect');
const menu = (user, guild) => {
    var menu = new MessageSelectMenu()
        .setCustomId(`soundboard_menu_${user}_fun`)
        .setPlaceholder('Select a sound effect!');
    if (db.get(`guildSpec.${guild}.soundboard`).keys().length > 0)db.get(`guildSpec.${guild}.soundboard`).keys().forEach(name => menu.addOptions({ label: name.charAt(0).toUpperCase() + name.slice(1), value: name }));
    else menu.setPlaceholder('You don\'t have any sound effects yet!').setDisabled(true).addOptions({label: 'none', value: 'disabled'});
    return menu;
}

module.exports.run = async (client, message, args) => { 
    if (!db.has(`guildSpec.${message.guild.id}.soundboard`))db.set(`guildSpec.${message.guild.id}.soundboard`, {});   
    await message.reply({
        embeds:[new MessageEmbed()
            .setColor(client.randToastColor())
            .setTitle("Soundboard")
        ],
        components: [
            new MessageActionRow().addComponents(menu(message.author.id, message.guild.id)),
            new MessageActionRow().addComponents(addButton.setCustomId(`soundboard_add_${message.author.id}_fun`))
        ]
    });
    /*const player = createAudioPlayer();
    player.play(
        createAudioResource(
            googleTTS.getAudioUrl(
                args.join(" "), {
                    lang: 'en',
                    slow: false,
                    host: 'https://translate.google.com',
                }
            )
        )
    );
    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.channel.guild.id,
        adapterCreator: message.channel.guild.voiceAdapterCreator,
    });
    connection.subscribe(player);*/
}

module.exports.button = async (client, interaction) => {
    var embed = new MessageEmbed()
        .setColor(client.randToastColor())
        .setTitle('Soundboard');
    switch(interaction.customId.split('_')[1]) {
        case 'add':
            await interaction.update({embeds: [embed.setDescription('reply with a name for the effect, followed by the youtube url seperated with a space!')]}).then(async () => {
                const filter = m => interaction.user.id == m.author.id && /.+ https:\/\/(www\.|)youtu(\.|)be(\.com|)\/.+/.test(m.content);
                interaction.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time']}).then(async message => {
                    Object.defineProperty(db.get(`guildSpec.${interaction.guild.id}.soundboard`), message.first().content.split(' ')[0], message.first().content.split(' ')[1]);
                    await interaction.editReply({
                        embeds: [embed],
                        components: [
                            new MessageActionRow().addComponents(menu(interaction.user.id, interaction.guild.id)),
                            new MessageActionRow().addComponents(addButton.setCustomId(`soundboard_add_${interaction.user.id}_fun`)),
                        ]
                    });
                }).catch(async (error) => {
                    console.error(error);
                    await interaction.editReply({embeds: [embed.setDescription('You took too long!')]})
                    setTimeout(async () => await interaction.editReply({ embeds: [embed]}), 1000);
                });
            });
        break;
        case 'remove':
            await interaction.update({
                embeds: [embed.setDescription(`Are you sure you want to delete \`${interaction.customId.split('_')[3]}\`?`)],
                components: [
                    new MessageActionRow().addComponents(menu(interaction.user.id, interaction.guild.id)),
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setLabel('Yes')
                            .setStyle('SUCCESS')
                            .setCustomId(`soundboard_deleteYes_${interaction.user.id}_${interaction.customId.split('_')[3]}_fun`),
                        new MessageButton()
                            .setLabel('No')
                            .setStyle('DANGER')
                            .setCustomId(`soundboard_deleteN1o_${interaction.user.id}_fun`)
                    )
                ]
            });
        break;
        case 'deleteYes': 
            db.delete(`guildSpec.${interaction.guild.id}.soundboard.${interaction.customId.split('_')[3]}`);
            await interaction.update({
                embeds: [embed.setDescription(`Got it! \`${interaction.customId.split('_')[3]}\` was removed from the soundboard!`)],
                components: []
            });
        break;
        case 'deleteNo':
            await interaction.update({
                embeds: [embed.setDescription('Okay person').setFooter('removed!')],
                components: []
            });
        break;
    }
}

module.exports.menu = async (client, interaction) => {
    await interaction.update({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setTitle('Soundboard')
                .setDescription(db.get(`guildSpec.${interaction.guild.id}.soundboard`)[interaction.values[0]])
        ],
        components: [
            new MessageActionRow().addComponents(menu(interaction.user.id, interaction.guild.id)),
            new MessageActionRow().addComponents(
                addButton.setCustomId(`soundboard_add_${message.author.id}_fun`),
                removeButton.setCustomId(`soundboard_remove_${message.author.id}_${interaction.values[0]}_fun`)
            )
        ]
    });
    
}