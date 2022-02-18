import fetch from 'node-fetch';

export async function chat(client, message, args) {
    message.channel.sendTyping();
    fetch('http://api.brainshop.ai/get?bid=163846&key=' + process.env.BRAINSHOP_TOKEN + '&uid=' + message.author.id + '&msg=' + message.content)
        .then(res => res.json()).then(res => setTimeout(() => message.channel.send(res.cnt), 10*res.cnt.length));
}