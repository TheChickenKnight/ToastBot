module.exports.info = {
    name: 'start',
    cooldown: 20,
    section: 'cells',
    description: 'Start your cellular adventure!',
    usage: 'start'
};

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (await client.redis.EXISTS('cell_' + message.author.id))return client.error(message, 'You have already started! Do <prefix>reset delete all of your progress then come back!');
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
        p_upgrades_membrane: 0,
        p_upgrades_flagella: 0,
        p_upgrades_mitochondrion: 0,
        p_upgrades_nucleus: false,
        p_upgrades_multi: false,
        p_upgrades_size: 1,
        p_upgrades_pili: 0,
        p_upgrades_cell_wall_thickness: 0,
        m_upgrades_cells: 1,
        m_upgrades_cells: 0,
        DNA_complexity: 5
    });
    require('./cell.js').run(client, message, []);
}