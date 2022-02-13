export const info = {
    name: 'memory',
    cooldown: 30,
    section: 'games',
    aliases: ['mem'],
    description: 'The mini game of sheer memorization...How long can you go for???',
    how_to_play: 'A series of buttons will flash. Then, you have to press those, in that order. Please keep in mind that if you press buttons too fast discord will stop you! Every time you get the sequence right it\'ll flash green and then repeat but with one more button!',
    usage: '<`prefix`>memory/mem'
};

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export async function run(client, message, args) {
    if (client.patterns.has(message.author.id))
        return client.error(message, 'You are currently in a game!');
    const first = Math.floor(Math.random()*9)+1;
    client.patterns.set(message.author.id, {
        pattern: [first],
        current: 0
    });
    const msg = await message.reply({
        content: '\u200b',
        components: [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`border1`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border2`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border3`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border4`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border5`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
            ),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`border6`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`memory_1_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('⬜'),
                new MessageButton()
                    .setCustomId(`memory_2_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟥'),
                new MessageButton()
                    .setCustomId(`memory_3_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟧'),
                new MessageButton()
                    .setCustomId(`border7`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
            ),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`border8`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`memory_4_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟨'),
                new MessageButton()
                    .setCustomId(`memory_5_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟩'),
                new MessageButton()
                    .setCustomId(`memory_6_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟦'),
                new MessageButton()
                    .setCustomId(`border9`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
            ),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`border10`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`memory_7_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟪'),
                new MessageButton()
                    .setCustomId(`memory_8_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('🟫'),
                new MessageButton()
                    .setCustomId(`memory_9_${message.author.id}_games`)
                    .setStyle('SECONDARY')
                    .setEmoji('⬛'),
                new MessageButton()
                    .setCustomId(`border11`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
            ),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`border12`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border13`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border14`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border15`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
                new MessageButton()
                    .setCustomId(`border16`)
                    .setStyle('DANGER')
                    .setLabel('\u200b')
                    .setDisabled(true),
            )
        ]
    });
    await showMsg(msg, [first], message.author.id);
};

export async function button(client, interaction) {
    let pattern = client.patterns.get(interaction.user.id);
    if (pattern.pattern[pattern.current] != interaction.customId.split('_')[1]) {
        client.patterns.delete(interaction.user.id);
        return interaction.update({
            embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('BOOM!! You Lost!\nYour Final Score was `' + (pattern.pattern.length - 1) + '`!')
            ],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border1`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border2`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border3`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border15`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border16`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border4`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled1')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                        new MessageButton()
                        .setCustomId('disabled2')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled3')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border5`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border6`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled4')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                        new MessageButton()
                        .setCustomId('disabled5')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled6')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border7`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border8`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled7')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                        new MessageButton()
                        .setCustomId('disabled8')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('disabled9')
                        .setStyle('DANGER')
                        .setLabel('💥')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border9`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border10`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border11`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border12`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border13`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border14`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                )
            ]
        });
    }
    await interaction.update({
        components: gen(pattern.pattern[pattern.current], interaction.user.id, pattern.pattern.length == 1)
    });
    if (pattern.current != pattern.pattern.length - 1) {
        pattern.current++;
        setTimeout(async () => await interaction.editReply({
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border1`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border2`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border3`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border4`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border5`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border6`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`memory_1_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('⬜'),
                    new MessageButton()
                        .setCustomId(`memory_2_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟥'),
                    new MessageButton()
                        .setCustomId(`memory_3_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟧'),
                    new MessageButton()
                        .setCustomId(`border7`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border8`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`memory_4_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟨'),
                    new MessageButton()
                        .setCustomId(`memory_5_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟩'),
                    new MessageButton()
                        .setCustomId(`memory_6_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟦'),
                    new MessageButton()
                        .setCustomId(`border9`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border10`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`memory_7_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟪'),
                    new MessageButton()
                        .setCustomId(`memory_8_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('🟫'),
                    new MessageButton()
                        .setCustomId(`memory_9_${interaction.user.id}_games`)
                        .setStyle('SECONDARY')
                        .setEmoji('⬛'),
                    new MessageButton()
                        .setCustomId(`border11`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border12`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border13`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border14`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border15`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border16`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                )
            ]
        }), 1000);
    } else {
        pattern.pattern.push(Math.floor(Math.random()*9)+1);
        pattern.current = 0;
        await interaction.editReply({
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border1`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border2`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border3`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border4`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border5`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border6`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled1`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled2`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled3`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border7`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border8`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled4`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled5`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled6`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border9`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border10`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled7`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled8`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`disabled9`)
                        .setStyle('SUCCESS')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border11`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                ),
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`border12`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border13`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border14`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border15`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`border16`)
                        .setStyle('DANGER')
                        .setLabel('\u200b')
                        .setDisabled(true),
                )
            ]
        });
        setTimeout(async () => await showInteraction(interaction, pattern.pattern, interaction.user.id), 500);
        
    }
    client.patterns.set(interaction.user.id, pattern);
};


function gen(button, id, disabled) {
    return [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`border1`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border2`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border3`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border4`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border5`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
        ),
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`border6`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`memory_1_${id}_games`)
                .setStyle(button == 1 ? 'PRIMARY' : 'SECONDARY')
                .setDisabled(disabled)
                .setEmoji('⬜'),
            new MessageButton()
                .setCustomId(`memory_2_${id}_games`)
                .setStyle(button == 2 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟥')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`memory_3_${id}_games`)
                .setStyle(button == 3 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟧')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`border7`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
        ),
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`border8`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`memory_4_${id}_games`)
                .setStyle(button == 4 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟨')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`memory_5_${id}_games`)
                .setStyle(button == 5 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟩')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`memory_6_${id}_games`)
                .setStyle(button == 6 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟦')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`border9`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
        ),
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`border10`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`memory_7_${id}_games`)
                .setStyle(button == 7 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟪')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`memory_8_${id}_games`)
                .setStyle(button == 8 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('🟫')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`memory_9_${id}_games`)
                .setStyle(button == 9 ? 'PRIMARY' : 'SECONDARY')
                .setEmoji('⬛')
                .setDisabled(disabled),
            new MessageButton()
                .setCustomId(`border11`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
        ),
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`border12`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border13`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border14`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border15`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
            new MessageButton()
                .setCustomId(`border16`)
                .setStyle('DANGER')
                .setLabel('\u200b')
                .setDisabled(true),
        )
    ]
};


async function showMsg(msg, steps, id) {
    for (let i = 0; i < steps.length; i++)
        setTimeout(async () => await msg.edit({
            components: gen(steps[i], id)
        }), i * 1000);
    setTimeout(async () => await msg.edit({
        components: gen(10, id, false)
    }), 1000 * steps.length);
};

async function showInteraction(interaction, steps, id) {
    for (let i = 0; i < steps.length; i++) {
        if (i > 0 && steps[i] == steps[i-1]) 
            setTimeout(async () => await interaction.editReply({
                components: gen(10, id)
            }), i * 1000);
        setTimeout(async () => await interaction.editReply({
            components: gen(steps[i], id)
        }), i * 1000);
    }
    setTimeout(async () => await interaction.editReply({
        components: gen(10, id, false)
    }), 1000 * steps.length);
};