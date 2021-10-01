module.exports.info = {
    name: 'dadjoke',
    cooldown: 2,
    section: 'fun',
    description: 'Ever wanted a dad?',
    usage: '<`prefix`>dadjoke/dj',
    dad: ' joke'
}

const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = (client, message, args) => {
    fetch('https://icanhazdadjoke.com/slack').then(res => res.json()).then(res => {
        message.reply({ embeds: [new MessageEmbed()
            .setTitle(["Dad", "Father", "Fatherly Figure", "Parent or Guardian", "Your Grandma's Son"][Math.floor(Math.random() * 4)])
            .setThumbnail(["https://i.ytimg.com/vi/9aWYWRePBiM/maxresdefault.jpg", "https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/57/2013/10/David-Beckham-main-1.jpg", "https://i2-prod.mirror.co.uk/incoming/article121831.ece/ALTERNATES/s615/david-beckham-pic-splash-608046054.jpg", "https://image.cnbcfm.com/api/v1/image/105820086-1553800673587preview.jpg?v=1553800689"][Math.floor(Math.random() * 5)])
            .setDescription('"' + res.attachments[0].text + '"')
            .setColor(client.randToastColor())
        ]})
    });
}