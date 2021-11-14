module.exports.info = {
    name: 'train',
    cooldown: 20,
    section: 'rpg',
    description: 'do you even lift bro?',
    usage: '<`prefix`>rpg'
};

const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports.run = async (client, message, args) => {
    var user = await client.redis.get(`users.${message.author.id}.rpg`);
    message.reply({
       embeds: [new MessageEmbed()
        .setColor(client.randToastColor())
        .setTitle("Training! (pretty basic tho)")
        .setDescription('click the various buttons below to train!')
        ],
        components: [
            client.rpgmenu(user.boss, 'train', message.author.id),
            new MessageActionRow().addComponents(buttonCreate(user, message.author.id))
        ]
    });
}

module.exports.button = async (client, interaction) => {
    const button = buttons.filter(button => button.value === interaction.values[0])[0];
    let embed = new MessageEmbed().setTitle(button.label).setDescription(button.description).setColor(client.randToastColor());
    let row = new MessageActionRow();
    switch(interaction.customId.split('_')[1]) {
        case 'determine':
            
        break;
        case 'pet':

        break;
        case 'chance':

        break;
        case 'skill':

        break;
        case 'auto':

        break;
    }
}


const buttons = [
    {
        value: 'determine',
        boss: -1,
        label: 'Pure Determination',
        description: 'Pure guts and determination. Do you have what it takes?'
    },
    {
        value: 'focus',
        boss: 2,
        label: 'Concentration',
        description: 'Focus. Focus with all of your mind.'
    },
    {
        value: 'chance',
        boss: 5,
        label: 'Are you lucky?',
        description: 'Leaving it up there with Lady Luck.'
    },
    {
        value: 'skill',
        boss: 10,
        label: 'Pure skill',
        description: 'From now on, your skill benefits your skill.'
    },
    {
        value: 'auto',
        boss: 25,
        label: 'when idle lmao',
        description: 'lol it\'s all easy now aha. No hard feelings?'
    }
];

const buttonCreate = (user, id) => buttons.map(button => new MessageButton().setCustomId(`train_${button.value}_${id}_rpg`).setDisabled(user.boss < button.boss).setStyle('SECONDARY').setLabel(user.boss >= button.boss ? button.label : 'Boss ' + button.boss));