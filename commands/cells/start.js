module.exports.info = {
    name: 'start',
    cooldown: 20,
    section: 'cells',
    description: 'Start your cellular adventure!',
    usage: 'start'
};

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (await client.redis.EXISTS('cell_' + message.author.id))return message.reply('You have already started! Do <prefix>reset delete all of your progress then come back!');
    message.reply({
        embeds: [new MessageEmbed().setDescription('Are you sure you would like to start?')],
        components: [new MessageActionRow().addComponents(new MessageButton().setStyle('SUCCESS').setLabel('✔️').setCustomId(`start_yes_${message.author.id}_cells`), new MessageButton().setStyle('DANGER').setLabel('❌').setCustomId(`start_no_${message.author.id}_cells`))]        
    });
}

module.exports.button = async (client, interaction) => {
    if (interaction.customId.split('_')[1] === 'no')return interaction.update({
        content: 'Got me all excited for nothing 😔',
        embeds: [],
        components: []
    });
    await client.redis.HMSET('cell_' + interaction.user.id, {
        xp: 0,
        level: 1,
        DNA: 0,
        cells: 1,
        upgrades_membrane: 0,
        upgrades_flagella: 0,
        upgrades_mitochondria: 0,
        upgrades_eukaryotes: false,
        upgrades_size: 1,
        upgrades_pili: 0
    });
    require('./cell.js').run(client, message, args);
}