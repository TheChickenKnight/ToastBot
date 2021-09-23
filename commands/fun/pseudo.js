module.exports.info = {
    name:"pseudo",
    aliases: ["psudo", "sudo", "psuedo"],
    description: `BECOME SOMEONE ELSE`,
    section: 'fun',
    cooldown: 2,
    usage: 'psudo/sudo/psuedo/pseudo <mention or nothing> <message>'
}

module.exports.run = async (client, message, args) => {
    let webhooks = await message.channel.fetchWebhooks();
    var webhook;
    webhooks.forEach(item => {if (item.owner.id == 873255148338688060)webhook = item});
    if (!webhook) {
        message.channel.createWebhook(message.channel + "ToastBot");
        webhooks = await message.channel.fetchWebhooks();
        webhooks.forEach(item => {if (item.owner.id == 873255148338688060)webhook = item});
    }
    const guild = await client.guilds.fetch(message.guild.id);
    let author = ""; let text = "";
    if (message.mentions.members.first()) {
        author = await client.users.fetch(message.mentions.members.first().id);
        text = args.slice(1).join(" ");
    } else {
        author = message.author;
        text = args.join(" ");
    }
    const member = guild.members.fetch(author.id);
    await webhook.send({
        content: text,
        username:  member.nickname,
        avatarURL: author.displayAvatarURL({format: 'png'}),
    });
}

