export const info = {
    name: 'server',
    cooldown: 10,
    section: 'utility',
    description: 'test',
    usage: 'test'
};

export async function run(client, message, args) {
    console.log(client.guilds.cache.get('940362172771467264').invites);
    for (let server of client.guilds.cache)
        message.reply(server);
}
