module.exports.info = {
    name: 'poll',
    aliases: ['vote'],
    cooldown: 20,
    section: 'utility',
    description: 'create a poll! Democracy!',
    usage: 'poll <number of options in poll or ignore for a yes or no>'
};

const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
    let poll = [];
    let menu = new MessageSelectMenu()
        .addOptions({
            label: 'End', 
            emoji: '❌', 
            description: 'End the poll!', 
            value: 'end'
        })
        .setCustomId(`poll_menu_all_utility`)
    const bar = client.barCreate(0);
    if (!args[1]) {
        poll = ['✔', '❌'];
        menu.addOptions(
            {
                label: 'I Agree',
                emoji: '✔',
                description: bar,
                value: '✔'
            },
            {
                label: 'I Disagree',
                emoji: '❌',
                description: bar,
                value: '❌'
            }
        )
    } else {
        if (args[1] == '1' || args[1] == '0')return message.reply('you need more than 1 options in a poll!');
        try {
            args[1] = Math.floor(parseInt(args[1]));
        } catch {
            return message.reply('you have to either give me nothing for a yes or no poll or a number!')
        }
        const filter = m => m.split(' ').length == 2 && m.author.id == message.author.id;
        await message.reply('Please send all ' + i +' option numbers in the syntax `label emoji`');
        const answer = await message.channel.awaitMessages({
            filter,
            time: 60000,
            max: args[1],
            errors: ['time']
        }).catch(() => message.reply('You didn\'t give me all ' + args[0] + 'options you mentioned before'));
        menu.addOptions(
            answer.map(m => {
                m = m.split(' ');
                return {
                    label: m[0],
                    emoji: m[1],
                    description: bar,
                    value: m[1]
                }
            })
        );
    }
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(client.randToastColor())
                .setDescription(args[0])
        ],
        components: [
            new MessageActionRow().addComponents(menu)
        ]
    });
};