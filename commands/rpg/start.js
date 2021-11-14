module.exports.info = {
    name: 'start',
    cooldown: 20,
    section: 'rpg',
    description: 'A new Beginning.',
    usage: '<`prefix`>start'
};

const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports.run = (client, message, args) => message.reply({ content: "Are you sure you want to do this? It might be too cool...", components: [new MessageActionRow().addComponents(new MessageButton().setLabel('✔️').setStyle('SUCCESS').setCustomId(`start_yes_${message.author.id}_rpg`), new MessageButton().setLabel('❌').setStyle('DANGER').setCustomId(`start_no_${message.author.id}_rpg`))]});

module.exports.button = async (client, interaction) => {
    if (interaction.customId.split('_')[1] == 'yes') {
        if (!(await client.redis.has(`users.${interaction.user.id}.rpg`))) {
            await client.redis.set(`users.${interaction.user.id}.rpg`, {
                stats: {
                    attack: 1,
                    defense: 1,
                    health: 10,
                    regen: 1,
                    reach: 1
                },
                inventory: [],
                equip: {
                    helmet: undefined,
                    chestplate: undefined,
                    leggings: undefined,
                    boots: undefined,
                    weapon: undefined,
                    offhand: undefined
                },
                level: 1,
                gold: 0,
                exp: 0,
                boss: 0
            });
            const boss = await client.fight({id: 0, interaction: interaction});
            interaction.update({
                content: '\u200b',
                embeds: [boss[0]],
                files: [boss[1]],
                components: [
                    client.rpgmenu(0, 'fight', interaction.user.id),
                    new MessageActionRow().addComponents(
                         new MessageButton()
                            .setStyle('PRIMARY')
                            .setCustomId(`fight_fight_${interaction.user.id}_rpg`)
                            .setLabel('FIGHT')
                    )
                ]
            });
        } else interaction.update({
            content: 'You\'ve already started! do <`prefix`>reset to remove all your progress!',
            components: []
        });
    } else interaction.update({
        content: 'Alright if you really don\'t want to.',
        components: []
    });
}