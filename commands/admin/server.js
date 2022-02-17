export const info = {
    name: 'server',
    cooldown: 10,
    section: 'utility',
    description: 'test',
    usage: 'test'
};


export async function run(client, message, args) {
    client.guids.forEach(guild => console.log(guild));
}
