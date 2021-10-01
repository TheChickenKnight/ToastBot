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

module.exports.run = (client, message, args) => fetch('https://icanhazdadjoke.com/slack').then(res => res.json()).then(res =>  message.reply({ embeds: [new MessageEmbed().setTitle(["Dad", "Father", "Fatherly Figure", "Parent or Guardian", "Your Grandma's Son", "Daddy", "Mr.", "Papa", "Pops", "Peepaw"][Math.floor(Math.random() * 10)]).setThumbnail(["https://i.ytimg.com/vi/9aWYWRePBiM/maxresdefault.jpg", "https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/57/2013/10/David-Beckham-main-1.jpg", "https://i2-prod.mirror.co.uk/incoming/article121831.ece/ALTERNATES/s615/david-beckham-pic-splash-608046054.jpg", "https://image.cnbcfm.com/api/v1/image/105820086-1553800673587preview.jpg", "http://everythreeweekly.com/wp-content/uploads/2018/01/Daddy.jpg", "https://akns-images.eonline.com/eol_images/Entire_Site/2014114/rs_634x1024-141204143910-634-dad-wiz-selfie-plane.jw.12414.jpg", "https://live.staticflickr.com/2824/9229027866_866173eef0_n.jpg", "https://www.betootaadvocate.com/wp-content/uploads/2015/07/angry-dad.jpg", "https://cdn.schoolofrock.com/img/staff-member-image/school-of-rock-seekonkstaffpic11532126989-21545164280.jpg"][Math.floor(Math.random() * 10)]).setDescription('**"**' + res.attachments[0].text + '**"**').setColor(client.randToastColor())]})); 