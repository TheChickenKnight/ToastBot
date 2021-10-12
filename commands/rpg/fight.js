module.exports.info = {
    name: 'fight',
    cooldown: 20,
    section: 'rpg',
    description: 'FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT ',
    usage: '<`prefix`>fight'
};

const { MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');

module.exports.run = (client, message, args) => {
    const user = db.get(`users.${message.author.id}.rpg`);
    const boss = client.fight(user.boss);
    message.reply({
        embeds: [boss[0].addField(message.author.username, '**Attack per second:** 1\n**Defense:** 1\n**HP:** 10', true)],
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

module.exports.button = (client, interaction) => {
    var user = db.get(`users.${interaction.user.id}.rpg`);
    var boss = client.fight({ id: user.boss });
    interaction.update({
        embeds: [boss[0]],
        files: [boss[1]],
        components: [
            client.rpgmenu(user.boss, 'fight', message.author.id),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId(`fight_stop_${message.author.id}_rpg`)
                    .setLabel('Stop')
            )     
        ]
    })
    for (let i = 0; boss[2].hp < 0 || user.stats.health < 0; i++)setTimeout(() => {
        
    }, 1000 * i);
}