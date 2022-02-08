export const info = {
    name: 'server',
    cooldown: 10,
    section: 'utility',
    description: 'test',
    usage: 'test'
};

export async function run(client, message, args) {
    const servers = client.guilds.cache;
    for (let server of servers)
        console.log(server + '\n\n');
}
