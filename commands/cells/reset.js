module.exports.info = {
    name: 'reset',
    cooldown: 20,
    section: 'cells',
    description: 'reset your cellular adventure!',
    usage: 'reset'
};

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!(await client.redis.EXISTS('cell_' + message.author.id)))return client.error(message, 'You haven\'t even started yet! Do <prefix>start to begin!');
    message.reply({
        embeds: [new MessageEmbed().setDescription('Are you sure you would like to reset?')],
        components: [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('✔️').setCustomId(`start_yes_${message.author.id}_cells`), new MessageButton().setStyle('DANGER').setLabel('❌').setCustomId(`start_no_${message.author.id}_cells`))]        
    });
}

module.exports.button = async (client, interaction) => {
    if (interaction.customId.split('_')[1] === 'no')interaction.update({
        content: 'good choice :D',
        embeds: [],
        components: []
    });
    await client.redis.DEL('cell_' + interaction.user.id);
    interaction.update({
        content: 'Aw, I hope you\'ll play again!',
        embeds: [],
        components: []
    });
}