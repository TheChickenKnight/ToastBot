export const info = {
    name: 'mineStatus',
    cooldown: 5,
    section: 'mining',
    aliases: ['mst'],
    description: 'Currently under development!',
    usage: 'mineStatus'
};

export async function run(client, message, args) {
    const user = await client.mineGet(message.author.id, 'all');
    console.log(user);
}