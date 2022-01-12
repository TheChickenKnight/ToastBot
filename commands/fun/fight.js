const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.info = {
    name: 'fight',
    cooldown: 1,
    section: 'fun',
    description: 'FIGHT FIGHT FIGHT',
    usage: 'fight <@ someone>'
};

module.exports.run = (client, message, args) => {
    if (!args[0])return client.error(message, 'You need to mention the person you want to fight.');
    const target = message.mentions.members.first();
    if (!target)return client.error(message, 'You can\'t fight a bot.');
    const healthPlusShield = '❤️ ' + client.barCreate(100) + '\n**100%**\n🛡️ ' + client.barCreate(0) + '\n**0%**';
    const first = [
        target.user,
        message.author
    ][Math.round(Math.random())];
    const second = first.id == target.user.id ? message.author : target.user;
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .addFields(
                    {
                        name: first.username + ' ⬅️',
                        value: healthPlusShield,
                        inline: true
                    },
                    {
                        name: second.username,
                        value: healthPlusShield,
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: 'Awaiting **' + first.username + '\'s** order!'
                    }
                )
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`fight_punch_${first.id}_${first.id}_100_0_${second.id}_100_0_fun`)
                    .setStyle('PRIMARY')
                    .setLabel('Punch'),
                new MessageButton()
                    .setCustomId(`fight_defend_${first.id}_${first.id}_100_0_${second.id}_100_0_fun`)
                    .setStyle('SECONDARY')
                    .setLabel('Defend'),
                new MessageButton()
                    .setCustomId(`fight_run_${first.id}_${first.id}_100_0_${second.id}_100_0_fun`)
                    .setStyle('DANGER')
                    .setLabel('Run'),
            )
        ]
    })
};

module.exports.button = async (client, interaction) => {
    var status, disabled = false;
    interaction.customId = interaction.customId.split('_');
    var first = await client.users.cache.get(interaction.customId[3]);
    first.health = parseInt(interaction.customId[4]);
    first.shield = parseInt(interaction.customId[5]);
    first.turn = interaction.customId[2] == first.id;
    var second = await client.users.cache.get(interaction.customId[6]);
    second.health = parseInt(interaction.customId[7]);
    second.shield = parseInt(interaction.customId[8]);
    second.turn = !first.turn;
    switch (interaction.customId[1]) {
        case 'punch':
            var damage = Math.floor(Math.random() * 27);
            var crit = false;
            if (damage == 26) {
                damage+=Math.floor(Math.random() * 26) + 25;
                crit = true;
            }
            damage-=Math.floor((first.turn ? second.shield : first.shield)/100*damage);
            if (first.turn) {
                damage-=Math.floor(second.shield/100*damage);
                second.health-=damage;
                status = `**${first.username}**`;
            } else {
                damage-=Math.floor(first.shield/100*damage);
                first.health-=damage;
                status = `**${second.username}**`;
            }
            if (damage > 10)status += ` landed ${crit ? 'a huuuge crit for' : 'a blow for'} **${damage}**!`;
            else status += ` ${['tapped', 'poked', 'stared'][Math.floor(Math.random()*3)]} for **${damage}**...`;
        break;
        case 'defend':
            var shield;
            if (first.turn) {
                shield = first.shield;
                status = `**${first.username}**`;
            } else {
                shield = second.shield;
                status = `**${second.username}**`;
            }

            var difference = shield;
            shield+=Math.floor(Math.random()*12);
            if (shield > 5 && shield != 11) shield-=Math.floor(Math.random()*5);
            else if (shield == 11) {
                status += ' **DRASTICALLY**';
                shield += Math.floor(Math.random()*5);
            }
            difference-=shield;
            difference=Math.abs(difference);
            status += ` gained ${difference} defense!`
            if (shield > 100) {
                status += ' If only your shield wasn\'t filled...';
                shield = 100;
            }
            
            if (first.turn) first.shield = shield;
            else second.shield = shield;


        break;
        case 'run':
            if (first.turn) {
                first.health = 0;
                first.shield = 0;
            } else {
                second.health = 0;
                second.shield = 0;
            }
            status = `While **${first.turn ? first.username : second.username}** was trying to run away, they tripped and fell lmao`;
            disabled = true;
        break;
    }
    if (first.health < 0) {
        disabled = true;
        status+=`\n$**${first.username}** IS OUT COLD!!! **${second.username}** IS DOWN!!!!`;
    } else if (second.health < 0) {
        disabled = true;
        status+=`\n$**${second.username}** IS OUT COLD!!! **${first.username}** IS DOWN!!!!`;
    }
    

    interaction.update({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .addFields(
                    {
                        name: `${first.username} ${second.turn ? '⬅️' : ''}`,
                        value: `❤️ ${client.barCreate(first.health)}\n**${first.health}%**\n🛡️ ${client.barCreate(first.shield)}\n**${first.shield}%**`,
                        inline: true
                    },
                    {
                        name: `${second.username} ${first.turn ? '⬅️' : ''}`,
                        value: `❤️ ${client.barCreate(second.health)}\n**${second.health}%**\n🛡️ ${client.barCreate(second.shield)}\n**${second.shield}%**`,
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: status
                    }
                )
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`fight_punch_${interaction.customId[2] == first.id ? second.id : first.id}_${first.id}_${first.health}_${first.shield}_${second.id}_${second.health}_${second.shield}_fun`)
                    .setStyle('PRIMARY')
                    .setLabel('Punch')
                    .setDisabled(disabled),
                new MessageButton()
                    .setCustomId(`fight_defend_${interaction.customId[2] == first.id ? second.id : first.id}_${first.id}_${first.health}_${first.shield}_${second.id}_${second.health}_${second.shield}_fun`)
                    .setStyle('SECONDARY')
                    .setLabel('Defend')
                    .setDisabled(disabled),
                new MessageButton()
                    .setCustomId(`fight_run_${interaction.customId[2] == first.id ? second.id : first.id}_${first.id}_${first.health}_${first.shield}_${second.id}_${second.health}_${second.shield}_fun`)
                    .setStyle('DANGER')
                    .setLabel('Run')
                    .setDisabled(disabled),
            )
        ]
    });
}
