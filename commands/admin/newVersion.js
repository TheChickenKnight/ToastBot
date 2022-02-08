export const info = {
    name: 'newVersion',
    aliases: ['newVer'],
    cooldown: 20,
    section: 'admin',
};

export async function run(client, message, args) { 
    await client.redis.HSET('bot', 'version', args[0] + '.0');
    message.reply('The Version was changed to what you said.');
}