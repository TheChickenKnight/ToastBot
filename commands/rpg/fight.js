module.exports.info = {
    name: 'fight',
    cooldown: 20,
    section: 'rpg',
    description: 'FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT FIGHT\n**RPG currently does not save your progress! Please keep this in mind if you try it out!**', 
    usage: '<`prefix`>fight'
};

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const user = await client.redis.get(`users.${message.author.id}.rpg`);
    const boss = await client.fight({ id: user.boss, message: message });
    await message.reply({
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

module.exports.button = async (client, interaction) => {
    var user = await client.redis.get(`users.${interaction.user.id}.rpg`);
    var boss = await client.fight({ id: user.boss, interaction: interaction });
    let bossHP = boss[2].hp, playerHP = user.stats.health;
    await interaction.update({ components: [] });
    let damages = [];
    while(bossHP > 0 && playerHP > 0) {
        bossHP-=(Math.round(user.stats.attack / boss[2].def)-Math.round(Math.pow(user.boss + 2, 6)/60));
        playerHP-=(Math.round(boss[2].att/user.stats.defense)-user.stats.regen);
        if (bossHP > boss[2].hp)bossHP = boss[2].hp;
        if (playerHP > user.stats.health)playerHP = user.stats.health;
        damages.push([bossHP < 0 ? 0 : bossHP, playerHP < 0 ? 0 : playerHP]);
    }
    damages.forEach((damage, i) => setTimeout(async () => interaction.editReply({embeds: [(await client.fight({id: user.boss, bossHP: damage[0], playerHP: damage[1], interaction: interaction}))[0]]}),i*1000));
    if (bossHP == 0)setTimeout(async () => {
            await client.redis.add(`users.${interaction.user.id}.rpg.boss`, 1);
            await client.redis.add(`users.${interaction.user.id}.rpg.exp`, Math.ceil(Math.pow(user.boss + 2, 6)/100));
            interaction.editReply({ content: "`\`\`\`css BOSS ${user.boss} WAS DEFEATED! YOU GAINED:\n\n.EXP:${Math.ceil(Math.pow(user.boss + 2, 6)/100)}!\`\`\``", embeds: [(await client.fight({id: user.boss + 1, interaction: interaction}))[0]], components: [
                client.rpgmenu(user.boss, 'fight', interaction.user.id),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setCustomId(`fight_fight_${interaction.user.id}_rpg`)
                        .setLabel('FIGHT')
                )
            ]});
        }, damages.length * 1000)
    else setTimeout(async () => interaction.editReply({content: `\`\`\`diff\n- you were defeated by Boss ${user.boss}\`\`\``, embeds: [(await client.fight({id: user.boss, interaction: interaction}))[0]], components: [
        client.rpgmenu(user.boss, 'fight', interaction.user.id),
        new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('PRIMARY')
                .setCustomId(`fight_fight_${interaction.user.id}_rpg`)
                .setLabel('FIGHT')
        )
    ]}), damages.length * 1000);
}