module.exports.info = {
    name:"pseudo",
    aliases: ["psudo", "sudo", "psuedo"],
    description: `BECOME SOMEONE ELSE`,
    section: 'fun',
    cooldown: 2,
    usage: 'psudo/sudo/psuedo/pseudo <mention or nothing> <message>'
};

module.exports.run = async (client, message, args) => {
    let webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == process.env.BOT_ID);
    if (!webhooks[0]) {
        await message.channel.createWebhook('ToastHook:' + message.channel.id);
        webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == process.env.BOT_ID);
    }
    var author, text;
    if (message.mentions.members.first())author = await client.users.fetch(message.mentions.members.first().id), text = args.slice(1).join(" ")
    else author = message.author, text = args.join(" ");
    await webhooks[0][1].send({ content: text, username: message.guild.members.cache.get(author.id).nickname || author.username, avatarURL: author.displayAvatarURL({format: 'png'})});
}

