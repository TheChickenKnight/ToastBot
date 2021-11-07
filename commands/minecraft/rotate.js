module.exports.info = {
    name: 'rotate',
    cooldown: 3,
    aliases: ['rot'],
    section: 'minecraft',
    description: 'check the status of your favorite server!',
    usage: 'mcst/mcstatus <server ip>'
};

const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    let rotation = 0;
    console.log(await getSkin(args[0], rotation))
    message.reply({
        embeds: [new MessageEmbed().setImage(await getSkin(args[0], rotation))]
    }).then(async msg => {
        for(let i = 0; i < 10; i ++)setInterval(async () => {
            rotation+=5;
            msg.edit({embeds: [new MessageEmbed().setImage(await getSkin(args[0], rotation))]});
        }, i * 500);
    });
}

const getSkin = async (name, rotation) =>  await fetch('https://minecraft-api.com/api/skins/' + name + '/body/-5.' + rotation);