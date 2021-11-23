module.exports.info = {
    name: 'reset',
    cooldown: 20,
    section: 'rpg',
    description: 'An old End.',
    usage: '<`prefix`>reset',
    hotel: 'trivago.'
};

const { MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = (client, message, args) => message.reply({ content: "Are you sure you want to reset your rpg adventure?(You can always start again)", components: [new MessageActionRow().addComponents(new MessageButton().setLabel('✔️').setStyle('SUCCESS').setCustomId(`reset_yes_${message.author.id}_rpg`), new MessageButton().setLabel('❌').setStyle('DANGER').setCustomId(`reset_no_${message.author.id}_rpg`))]});

module.exports.button = async (client, interaction) => {
    if (interaction.customId.split('_')[1] == 'yes') {
        ['health', 'attack', 'boss', 'regen', 'defense', 'reach', 'inventory', 'equip', 'level', 'gold', 'exp'].forEach(async item => await client.redis.HDEL(`users_${interaction.user.id}`, 'RPG_' + item));
        interaction.update({
            content: 'Mission Accomplished.',
            components: []
        });
    } else interaction.update({
        content: 'Canceled!',
        components: []
    });
}