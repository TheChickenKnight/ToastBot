export const info = {
    name: 'toasterbreadmilk',
    aliases: ['rps', 'rockpaperscissors'],
    cooldown: 20,
    section: 'games',
    description: 'literally just rock paper scissors lmao',
    how_to_play: '<:toaster:877591407668396043> toasts 🍞, 🍞 absorbs 🥛, and 🥛 short-circuits <:toaster:877591407668396043>.',
    solo_or_multiplayer: 'both! just don\'t ping anyone for solo!',
    usage: 'toasterbreadmilk/rockpaperscissors/rps <@ someone>'
};

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
var toasterButton = new MessageButton().setEmoji('<:toaster:877591407668396043>').setStyle('SECONDARY'),
milkButton = new MessageButton().setEmoji('🥛').setStyle('SECONDARY'),
breadButton = new MessageButton().setEmoji('🍞').setStyle('SECONDARY');
function victory(choice, answer) {
    return (choice == answer) ? 'tied.' : ((choice == '<:toaster:877591407668396043>' && answer == '🍞') || (choice == '🍞' && answer == '🥛') || (choice == '🥛' && answer == '<:toaster:877591407668396043>')) ? 'won!' : 'lost.';           
} 

export function run(client, message, args) {
    var embed = new MessageEmbed().setColor(client.randToastColor()).setTitle('~~RockPa~~ TOASTERBREADMILK').setFooter('try the help command for what beats what.');
    const target = message.mentions.members.first();
    var ids;
    if (!target) {
        ids = message.author.id;
        embed.setDescription('Pick an option!');
    } else {
        ids = `${message.author.id}<->${target.id}`;
        embed.addFields(
            { name: message.author.username, value: 'Choosing...', inline: true},
            { name: target.user.username, value: 'Choosing...', inline: true},
        );
    }
    message.reply({
        embeds: [embed],
        components: [
            new MessageActionRow()
                .addComponents(
                    toasterButton.setCustomId(`toasterbreadmilk_<:toaster:877591407668396043>_${ids}_games`).setDisabled(false),
                    milkButton.setCustomId(`toasterbreadmilk_🥛_${ids}_games`).setDisabled(false),
                    breadButton.setCustomId(`toasterbreadmilk_🍞_${ids}_games`).setDisabled(false)
                )
        ]
    });
}

export async function button (client, interaction) {
    var embed = new MessageEmbed().setColor(client.randToastColor()).setTitle('TOASTERBREADMILK');
    const interArray = interaction.customId.split('_');
    if (!interaction.customId.includes('<->')) {
        var answer;
        switch(Math.floor(Math.random() * 3)) {
            case 0: answer = '<:toaster:877591407668396043>';
            break;
            case 1: answer = '🥛';
            break;
            case 2: answer = '🍞';
            break;
        }

        await interaction.update({
            embeds: [embed.setDescription('Chosen! Ready...')],
            components: [
                new MessageActionRow()
                    .addComponents(
                        toasterButton.setDisabled(true),
                        milkButton.setDisabled(true),
                        breadButton.setDisabled(true)
                    )
            ]
        });
        setTimeout(async function() {
            await interaction.editReply({embeds: [embed.setDescription('Chosen! Toaster!')]});
            setTimeout(async function() {
                await interaction.editReply({embeds: [embed.setDescription('Chosen! Bread!')]});
                setTimeout(async function() {
                    await interaction.editReply({embeds: [embed.setDescription('Chosen! Milk!')]});
                    setTimeout(async function() {
                        await interaction.editReply({embeds: [embed.setDescription('SHOOT!')]});
                        setTimeout(async function() {
                            await interaction.editReply({embeds: [embed.setDescription(`Hm. It seems you have ${victory(interArray[1], answer)}`).addFields({ name: 'You Chose:', value: interArray[1], inline: true }, { name: 'I Chose:', value: answer, inline: true })]}), 1000
                        }, 1000)
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 3000);
    } else {
        if (client.toasterbreadmilk.has(interaction.user.id))return interaction.reply({
            content: 'You already picked ' + client.toasterbreadmilk.get(interaction.user.id),
            ephemeral: true
        });
        client.toasterbreadmilk.set(interaction.user.id, interArray[1]);
        var otherguy = interArray[2].split('<->')[0];
        var presser = interaction.user.id;
        if (otherguy == presser)otherguy = await client.users.fetch(interArray[2].split('<->')[1]);
        else otherguy = await client.users.fetch(otherguy);
        presser = await client.users.fetch(presser);
        embed.addField(presser.id == interArray[2].split('<->')[0] ? presser.username : otherguy.username, client.toasterbreadmilk.has(interArray[2].split('<->')[0]) ? '`  `' : 'Choosing...', true)
        .addField(otherguy.id == interArray[2].split('<->')[1] ? otherguy.username : presser.username, client.toasterbreadmilk.has(interArray[2].split('<->')[1]) ? '`  `' : 'Choosing...', true);
        if (!client.toasterbreadmilk.has(otherguy.id))await interaction.update({embeds: [embed.setFooter('try the help command for what beats what.')]});
        else {
            var win = victory(client.toasterbreadmilk.get(interArray[2].split('<->')[0]), client.toasterbreadmilk.get(interArray[2].split('<->')[1]))
            if (win == 'won!')win = presser.id == interArray[2].split('<->')[0] ? presser.username : otherguy.username + ' has won!';
            else if (win == 'lost.')win = otherguy.id == interArray[2].split('<->')[1] ? otherguy.username : presser.username + ' has won!';
            else win = 'it was a tie.';
            await interaction.update({ embeds: [embed.setDescription('Ready?')], components: [
                new MessageActionRow().addComponents(
                    toasterButton.setDisabled(true),
                    milkButton.setDisabled(true),
                    breadButton.setDisabled(true)
                )
            ]});   
            setTimeout(async function() {
                await interaction.editReply({embeds: [embed.setDescription('Toaster!')]});
                setTimeout(async function() {
                    await interaction.editReply({embeds: [embed.setDescription('Bread!')]});
                    setTimeout(async function() {
                        await interaction.editReply({embeds: [embed.setDescription('Milk!')]});
                        setTimeout(async function() {
                            await interaction.editReply({embeds: [embed.setDescription('SHOOT!')]});
                            setTimeout(async function() {
                                await interaction.editReply({embeds: [new MessageEmbed()
                                    .setColor(client.randToastColor())
                                    .setTitle('TOASTBREADMILK')
                                    .setDescription(win)
                                    .addFields(
                                        { name: presser.id == interArray[2].split('<->')[0] ? presser.username : otherguy.username, value: client.toasterbreadmilk.get(interArray[2].split('<->')[0]), inline: true },
                                        { name: otherguy.id == interArray[2].split('<->')[1] ? otherguy.username : presser.username, value: client.toasterbreadmilk.get(interArray[2].split('<->')[1]), inline: true }
                                    )
                                ]});
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 3000);
        }
    }
}