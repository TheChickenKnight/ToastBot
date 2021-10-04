module.exports.info = {
    name: 'joke',
    cooldown: 2,
    section: 'fun',
    description: 'An assortment of jokes! fun for the whole family!',
    usage: '<`prefix`>joke',
}

const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    let webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == "873255148338688060");
    if (!webhooks[0]) {
        await message.channel.createWebhook('ToastHook:' + message.channel.id);
        webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == "873255148338688060");
    }
    if(Math.round(Math.random()))fetch('https://icanhazdadjoke.com/slack').then(res => res.json()).then(res =>  webhooks[0][1].send({ content: res.attachments[0].text, username: ["Dad", "Father", "Fatherly Figure", "Parent or Guardian", "Your Grandma's Son", "Daddy", "Mr.", "Papa", "Pops", "Peepaw"][Math.floor(Math.random() * 10)], avatarURL: ["https://i.ytimg.com/vi/9aWYWRePBiM/maxresdefault.jpg", "https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/57/2013/10/David-Beckham-main-1.jpg", "https://i2-prod.mirror.co.uk/incoming/article121831.ece/ALTERNATES/s615/david-beckham-pic-splash-608046054.jpg", "https://image.cnbcfm.com/api/v1/image/105820086-1553800673587preview.jpg", "http://everythreeweekly.com/wp-content/uploads/2018/01/Daddy.jpg", "https://akns-images.eonline.com/eol_images/Entire_Site/2014114/rs_634x1024-141204143910-634-dad-wiz-selfie-plane.jw.12414.jpg", "https://live.staticflickr.com/2824/9229027866_866173eef0_n.jpg", "https://www.betootaadvocate.com/wp-content/uploads/2015/07/angry-dad.jpg", "https://cdn.schoolofrock.com/img/staff-member-image/school-of-rock-seekonkstaffpic11532126989-21545164280.jpg"][Math.floor(Math.random() * 10)]})); 
    else fetch('https://v2.jokeapi.dev/joke/Any?safe-mode').then(res => res.json()).then(res => fetch('https://randomuser.me/api/').then(resp => resp.json()).then(async resp => {
        await webhooks[0][1].send({ content: res.joken || res.setup, username: resp.results[0].name.first + ' ' + resp.results[0].name.last, avatarURL: resp.results[0].picture.thumbnail});
        if (res.type = 'twopart')setTimeout(() => webhooks[0][1].send({ content: res.delivery, username: resp.results[0].name.first + ' ' + resp.results[0].name.last, avatarURL: resp.results[0].picture.thumbnail}), 2000);
    }));
}