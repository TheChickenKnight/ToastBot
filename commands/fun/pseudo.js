module.exports.info = {
    name:"pseudo",
    aliases: ["psudo", "sudo", "psuedo"],
    description: `BECOME SOMEONE ELSE`,
    section: 'fun',
    cooldown: 2,
    usage: 'psudo/sudo/psuedo/pseudo <mention or nothing> <message>'
}

module.exports.run = async (client, message, args) => {
    let webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == 873255148338688060);
    if (!webhooks[0]) {
        await message.channel.createWebhook('ToastHook:' + message.channel.id);
        webhooks = Array.from(await message.channel.fetchWebhooks()).filter(item => item[1].owner.id == 873255148338688060);
    }
    [author, text] = message.mentions.members.first() ? [await client.users.fetch(message.mentions.members.first().id), text = args.slice(1).join(" ")] : [message.author, args.join(" ")];
    await webhooks[0][1].send({ content: text, username:  await client.guilds.fetch(message.guild.id).members.fetch(author.id).nickname, avatarURL: author.displayAvatarURL({format: 'png'})});
}

