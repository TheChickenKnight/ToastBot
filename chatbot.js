import fetch from 'node-fetch';

export async function chat(client, message, args) {
    message.channel.sendTyping();
    fetch('http://api.brainshop.ai/get?bid=163846&key=0dGgxyMT9uDkYinn&uid=' + message.author.id + '&msg=' + message.content)
        .then(res => res.json()).then(res => setTimeout(() => message.reply(res.cnt), 10*res.cnt.length));
}