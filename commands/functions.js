import pkg from 'ytdl-core';
const { getBasicInfo } = pkg;

const creBar = (type, level) => '<:' + type + level + 'Bar:' + (type == 'l' ? (level == 0 ? '897903792371171379' : (level == 1 ? '897904228109008907' : (level == 2 ? '897904571064672287' : (level == 3 ? '897904670780055573' : (level == 4 ? '897904771439136798' : '897903598829178950'))))) : (type == 'r' ? (level == 0 ? '897905864118251602' : (level == 1 ? '897905324990791721' : (level == 2 ? '897905425205321768' : (level == 3 ? '897905541362376704' : (level == 4 ? '897905636992503848' : '897905716256469052'))))) : (level == 0 ? '897906311495303168' : (level == 1 ? '897906423030222899' : (level == 2 ? '897906503397298186' : (level == 3 ? '897906621039140865' : (level == 4 ? '897906714471465061' : '897906793768964136'))))))) + '>';

export function barCreate(per) {
    if (per > 100)
        per = 100;
    if (per < 0)
        per = 0;
    per /= 2;
    var bar = creBar('l', per > 5 ? 5 : Math.round(per));
    for (let i = 2; i <= 9; i++) 
        bar += creBar('m', Math.round(per + 5 - i*5 > 5 ? 5 : (per + 5 - i*5 < 0 ? 0 : per + 5 - i*5)));
    return bar + creBar('r', per - 45 < 0 ? 0 : Math.floor(per - 45)); 
}

export function error(message, text) {
    return message.reply({content: client.tips(), embeds: [new MessageEmbed().setColor('RED').setDescription('`❌` ' + text)]});
}

export function randToastColor() {
    return ['#ffe6cc', '#996600', '#ffdd99', '#663300', '#331a00'][Math.floor(Math.random() * 5)];
}

export async function createEmbed(url, author, queue) {
    const info = (await getBasicInfo(url, { lang: 'en', requestOptions: { headers: { cookie: process.env.YOUTUBE_COOKIES }}})).videoDetails;
    return info.age_restricted ? [false, new MessageEmbed().setColor('RED').setDescription('Sorry, but this video is NSFW')] : [
        true, 
        new MessageEmbed().setColor('GREEN').setDescription('**"[' + info.title + '](' + info.video_url + ')"** `' + client.stof(info.lengthSeconds) + '`\n' + parseInt(info.likes).toLocaleString('en-US') + '👍 | ' + parseInt(info.viewCount).toLocaleString('en-US') + ' **Views**').setImage(info.thumbnails[0].url).setAuthor({name: ('By ' + info.author.name + (info.author.verified ? ' ✔️' : '')), iconURL: info.author.thumbnails[0].url, url: info.ownerProfileUrl}), 
        url,
        info.title,
        new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId(`queue_menu_${author}_music`).addOptions(queue.titles.map((item, i) => new Object({ label: item, value: queue.queue[i], description: client.stof(info.lengthSeconds)})))),
        client.stof(info.lengthSeconds)
    ];
}

export function stof(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    return (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm' : '') + (h == 0 ? ' ' + (d - h*3600 - m*60) + 's' : ''); 
}

export function caps(text) {
     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const tips = [
    'Don\'t like the default prefix? Use <`prefix`>prefix <`new prefix`> to change it!',
    'Could there be secrets in this bot???? ? ?!?? ?!!? IDK!! ?',
    'The `play` command both supports direct urls and search terms!',
    'When you get an error message, it DMs my developer only the error message and the command that errored.',
    'Plans for a playlist command is in the making!',
    'You can\'t currently turn off tips but there are plans for a settings command',
    'Plans for a Mining-based RPG in the making!',
    'NEW!!! Feedback Command is now IN!!!\nIt will directly message my developer, no matter what it is!\nHave fun 😏!',
    'haha ~~i~~magine if a ~~t~~ip ha~~d~~ s~~o~~m~~e~~ ~~s~~ort of secret ahahahaha',
    'It would be really cool if you voted for me on top.gg :D',
    'Try out our mini game commands! <`prefix`>help games',
    'ToastBot now talks back! he\'ll respond to any sentence with "toastbot" or "toast bot" with any case now!',
    'ToastBot now talks back! he\'ll respond to any sentence with "toastbot" or "toast bot" with any case now!',
    'ToastBot now talks back! he\'ll respond to any sentence with "toastbot" or "toast bot" with any case now!',
    'ToastBot now talks back! he\'ll respond to any sentence with "toastbot" or "toast bot" with any case now!'

];

export function tips() { 
    if (Math.floor(Math.random() * 4) == 0)
        return '**TIP**: ' + tips[Math.floor(Math.random() * tips.length)];
};

