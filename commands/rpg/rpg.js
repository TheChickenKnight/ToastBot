module.exports.info = {
    name: 'rpg',
    cooldown: 20,
    section: 'rpg',
    description: 'Let\'s you access the rpg menu.',
    usage: '<`prefix`>rpg'
};

const { MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports.run = (client, message, args) => {
    const user = db.get(`users.${message.author.id}.rpg`);
    const boss = client.fight({id: user.boss, message: message});
    message.reply({
        embeds: [boss[0]],
        files: [boss[1]],
        components: [
            client.rpgmenu(user.boss, 'fight', message.author.id),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setCustomId(`fight_fight_${message.author.id}_rpg`)
                    .setLabel('FIGHT')
            )
        ]
    });
}

module.exports.menu = (client, interaction) => {
    interaction.author = interaction.user;
    require(`./${interaction.values[0]}.js`).run(client, interaction, []);
}