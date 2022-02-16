export const info = {
    name: 'server',
    cooldown: 10,
    section: 'utility',
    description: 'test',
    usage: 'test'
};


export async function run(client, message, args) {
    const obj = client.guilds.cache.get('795142857354248212');
    client.guids.forEach(guild => console.log(guild));
}
