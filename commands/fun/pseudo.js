module.exports.info = {
    name:"pseudo",
    aliases: ["psudo", "sudo", "psuedo"],
    description: `BECOME SOMEONE ELSE`,
    section: 'fun',
    cooldown: 2,
    usage: 'psudo/sudo/psuedo/pseudo <mention or nothing> <message>'
}

module.exports.run = async (client, message, args) => {
    let webhooks = await message.channel.fetchWebhooks().filter(item => item.owner.id == 873255148338688060), author = "", text = ""; 
    if (!webhooks[0]) {
        message.channel.createWebhook(message.channel + "ToastBot");
        webhooks = await message.channel.fetchWebhooks().filter(item => item.owner.id == 873255148338688060);
    }
    [author, text] = message.mentions.members.first() ? [await client.users.fetch(message.mentions.members.first().id), text = args.slice(1).join(" ")] : [message.author, args.join(" ")];
    await webhooks[0].send({ content: text, username:  await client.guilds.fetch(message.guild.id).members.fetch(author.id).nickname, avatarURL: author.displayAvatarURL({format: 'png'})});
}

