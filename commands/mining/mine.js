import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./data.json");

export const info = {
    name: 'mine',
    cooldown: 5,
    section: 'mining',
    aliases: ['mines'],
    description: 'Currently under development!',
    usage: 'mine'
};

export async function run(client, message, args, interaction) {
    if (message.author.id != process.env.OWNER_ID)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription('Sorry, this command is currently unavailable but is being actively developed!')]
        });
    const user = await client.mineGet(message.author.id);
    const mines = Object.keys(data.mines).filter(mine => data.mines[mine].level <= user.level / 100).map(mine => data.mines[mine]);
    var parameters = { 
        embeds: [new MessageEmbed()
            .setColor(client.randToastColor())
            .setDescription(user.miningStatus.status == 'mining' ? 'You are currently mining, but you can still look at available mines!' : 'use the menu to find available mines!')],
        components: [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`mine_options_${message.author.id}_mining`)
                    .addOptions(
                        { label: 'Profile', description: 'A list of your stats', value: 'profile', emoji: '🧍'},
                        { label: 'Mines', description: 'All of the mines you can go to and start mining!', default: true, value: 'mine', emoji: '⛰️'},
                        { label: 'Ores Inventory', description: 'Current ores from your mine!', value: 'ores', emoji: '<:iron:869701384235253771>'},
                        { label: 'Mores Inventory', description: 'Every other item is here', value: 'inventory', emoji: '⛏️' },
                        { label: 'Status', description: 'More stats on your current expedition', value: 'mineStatus', emoji: '🔁' }
                    )
                ),
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`mine_mines_${message.author.id}_mining`)
                    .addOptions(
                        ...mines.map(mine => {
                            return {
                                label: client.caps(mine.name) + ' Mines',
                                description: 'Level ' + mine.level + ' | ' + mine.description,
                                value: mine.name
                            };
                        })
                    ).setPlaceholder('Available Mines')
            )
        ]
    };
    if (user.miningStatus.status == 'mining')
        parameters.components.push(new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`mine_stop_${message.author.id}_mining`)
                .setLabel('Stop Mining')
                .setStyle('DANGER')
                .setEmoji('🛑')
        ));
    if (interaction)
        interaction.update(parameters);
    else 
        message.reply(parameters);
}

export async function button(client, interaction) {
    var user = client.mineGet(interaction.user.id)
    if (interaction.customId.split('_')[1] == 'start') {
        if (user.backpack.empty == 0)
            return client.error(interaction, 'You should sell your ores first. Your inventory is full!');
        if (user.stats.stamina.current == 0)
            return client.error(interaction, 'You\'re too tired to start mining now! Keep resting or eat something.');
        Object.keys(data.mines[interaction.customId.split('_')[3]].ores).forEach(ore => user.backpack.ores[ore] = 0);
        user.miningStatus = {
            status: 'mining',
            location: interaction.customId.split('_')[3],
            start: Date.now()
        }
    } else {
        const mine = data.mines[user.miningStatus.location];
        if (user.miningStatus.status == 'mining') {
            var time = Date.now() - user.miningStatus.start;
            if (time > user.stats.stamina.current * 3600000) {
                user.miningStatus.status = 'tired';
                user.miningStatus.end = user.miningStatus.start + user.stats.stamina.current * 3600000;
                user.stats.stamina.current = 0;
            }
            const hours = (user.miningStatus.end - user.miningStatus.start) / 3600000;
            for (let i = 0; i < hours; i++) {
                const random = Math.floor(Math.random() * 100) + 1;
                if (user.backpack.empty > 0) {
                    Object.keys(data.mines[interaction.customId.split('_')[3]].ores).forEach(ore => {
                        if (data.mines[interaction.customId.split('_')[3]].ores[ore].min <= random && random <= data.mines[interaction.customId.split('_')[3]].ores[ore].max && user.backpack.empty - data.ores[ore].weight >= 0) {
                            user.backpack.ores[ore]++; 
                            user.backpack.empty-=data.ores[ore].weight;
                            user.backpack.totalores++;
                        }
                    });
                } else 
                    break;
            }
            const random = Math.floor(Math.random() * 7) - 2;
            if ((user.miningStatus.end || Date.now()) - user.miningStatus.start / 7200000 + random > user.backpack.empty) {
                user.miningStatus.status = 'full';
                user.miningStatus.end = user.backpack.totalores * 3600000 + user.miningStatus.start;
            }
        }



            
    }
}

export async function menu(client, interaction) {
    if (interaction.customId.split('_')[1] == 'options')
        import('./' + interaction.values[0] +'.js').then(file => file.run(client, { author: interaction.user }, [], interaction));
    else {
        const user = await client.mineGet(interaction.user.id);
        const mine = data.mines[interaction.values[0]];
        const parameters = {
            embeds: [
                new MessageEmbed()
                    .setColor(mine.color)
                    .setDescription(mine.description)
                    .setTitle(client.caps(mine.name) + ' Mines (Mine # ' + (mine.id+1) + ')')
                    .addFields(
                        { name: 'Traps', value: Object.keys(mine.traps).map((trap, i) => (i+1) + '. The **' + (!user.discovered.traps.includes(trap) ? (trap.split('').map(letter => '?').join('')) : client.caps(trap)) + '** Trap').join('\n'), inline: true },
                        { name: 'Ores', value: Object.keys(mine.ores).map((ore, i) => (i+1) + '. **' + (!user.discovered.ores.includes(ore) ? (ore.split('').map(letter => '?').join('')) : client.caps(ore)) + '** Ore').join('\n'), inline: true },
                        { name: 'Drops', value: mine.drops.map((drop, i) =>  (i+1) + '. **' + (!user.discovered.items.includes(drop.name) ? (drop.name.split('').map(letter => '?').join('')) : client.caps(drop.name)) + '** ' + client.caps(data.items[drop.name].type)).join('\n'), inline: true }
                    )
            ],
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`mine_options_${interaction.user.id}_mining`)
                        .addOptions(
                            { label: 'Profile', description: 'A list of your stats', value: 'profile', emoji: '🧍'},
                            { label: 'Mines', description: 'All of the mines you can go to and start mining!', default: true, value: 'mine', emoji: '⛰️'},
                            { label: 'Ores Inventory', description: 'Current ores from your mine!', value: 'ores', emoji: '<:iron:869701384235253771>'},
                            { label: 'Mores Inventory', description: 'Every other item is here', value: 'inventory', emoji: '⛏️' },
                            { label: 'Status', description: 'More stats on your current expedition', value: 'mineStatus', emoji: '🔁' }
                        )
                    ),
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`mine_mines_${interaction.user.id}_mining`)
                        .addOptions(
                            ...Object.keys(data.mines).filter(mine => data.mines[mine].level <= user.level / 100).map(mine => data.mines[mine]).map(mine => {
                                return {
                                    label: client.caps(mine.name) + ' Mines',
                                    description: 'Level ' + mine.level + ' | ' + mine.description,
                                    value: mine.name,
                                    default: interaction.values[0] == mine.name
                                };
                            })
                        )
                )
            ]
        };
        if (user.miningStatus.status == 'mining')
            parameters.components.push(new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`mine_stop_${interaction.user.id}_mining`)
                    .setLabel('Stop Mining')
                    .setStyle('DANGER')
                    .setEmoji('🛑')
            ));
        else    
            parameters.components.push(new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`mine_start_${interaction.user.id}_${interaction.values[0]}_mining`)
                    .setLabel('Mine HERE')
                    .setStyle('PRIMARY')
                    .setEmoji('⛏️')
            ))
        interaction.update(parameters);
    }
}