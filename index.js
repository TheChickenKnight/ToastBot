const lastCommand = {};
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----\n' + error + '\n----- Exception origin -----\n' + origin);
    client.users.cache.get(process.env.OWNER_ID).send('**----- Uncaught exception -----**\n' + error + '\n----- Exception origin -----\n' + origin + '\n---------------\nCommand ' + (Object.keys(lastCommand).includes('commandObj') ? lastCommand.commandObj.info.name : 'Unknown'));
});
process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----\n' + promise + '\n----- Reason -----\n' + reason);
    if (lastCommand.message)
        lastCommand.message.reply(`It seems you have encountered an error while using this command! The developer has been notified!`);
    client.users.cache.get(process.env.OWNER_ID).send('**----- Unhandled Rejection at -----**\n' + promise + '\n----- Reason -----\n' + reason + '\n---------------\nCommand ' + (Object.keys(lastCommand).includes('commandObj') ? lastCommand.commandObj.info.name : 'Unknown') + '\n' + lastCommand.message.url);
});


import { Client, Intents, Collection, MessageEmbed, MessageSelectMenu, MessageActionRow } from 'discord.js';
import pkg from 'ytdl-core';
const { getBasicInfo } = pkg;
import fs from 'fs'; 
import dotenv from 'dotenv';
import redis from 'async-redis';
dotenv.config();

const client = new Client({
    ws: { 
        properties: { 
            $browser: 'Discord iOS'
        }
    }, 
    intents: [ 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_VOICE_STATES, 
        Intents.FLAGS.DIRECT_MESSAGES, 
        Intents.FLAGS.GUILD_WEBHOOKS 
    ]
});

console.log('Welcome to ToastBot\'s Console!');
client.redis = redis.createClient({
    url: 'redis://PsOk59q1LIraszrKzWg8u02OvH12NLx6@redis-10932.c267.us-east-1-4.ec2.cloud.redislabs.com:10932'
});

client.commands = new Collection(), client.aliases = new Collection(), client.cooldowns = new Collection(), client.timeIDs = new Collection(), client.snipe = new Collection(), client.tictactoe = new Collection(), client.toasterbreadmilk = new Collection(), client.queues = new Collection(), client.paused = new Collection();

const creBar = (type, level) => '<:' + type + level + 'Bar:' + (type == 'l' ? (level == 0 ? '897903792371171379' : (level == 1 ? '897904228109008907' : (level == 2 ? '897904571064672287' : (level == 3 ? '897904670780055573' : (level == 4 ? '897904771439136798' : '897903598829178950'))))) : (type == 'r' ? (level == 0 ? '897905864118251602' : (level == 1 ? '897905324990791721' : (level == 2 ? '897905425205321768' : (level == 3 ? '897905541362376704' : (level == 4 ? '897905636992503848' : '897905716256469052'))))) : (level == 0 ? '897906311495303168' : (level == 1 ? '897906423030222899' : (level == 2 ? '897906503397298186' : (level == 3 ? '897906621039140865' : (level == 4 ? '897906714471465061' : '897906793768964136'))))))) + '>';

client.barCreate = per => {
    if (per > 100)
        per = 100;
    if (per < 0)
        per = 0;
    per /= 2;
    var bar = creBar('l', per > 5 ? 5 : Math.round(per));
    for (let i = 2; i <= 9; i++) 
        bar += creBar('m', Math.round(per + 5 - i*5 > 5 ? 5 : (per + 5 - i*5 < 0 ? 0 : per + 5 - i*5)));
    return bar + creBar('r', per - 45 < 0 ? 0 : Math.floor(per - 45)); 
}

client.error = (message, text) => message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription('`❌` ' + text)]});

client.randToastColor = () => ['#ffe6cc', '#996600', '#ffdd99', '#663300', '#331a00'][Math.floor(Math.random() * 5)];

client.createEmbed = async (url, author, queue) => {
    const info = (await getBasicInfo(url, { lang: 'en'})).videoDetails;
    return info.age_restricted ? [false, new MessageEmbed().setColor('RED').setDescription('Sorry, but this video is NSFW')] : [
        true, 
        new MessageEmbed().setColor('GREEN').setDescription('**"[' + info.title + '](' + info.video_url + ')"** `' + client.stof(info.lengthSeconds) + '`\n' + parseInt(info.likes).toLocaleString('en-US') + '👍 | ' + parseInt(info.viewCount).toLocaleString('en-US') + ' **Views**').setImage(info.thumbnails[0].url).setAuthor('By ' + info.author.name + (info.author.verified ? ' ✔️' : ''), info.author.thumbnails[0].url, info.ownerProfileUrl), 
        url,
        info.title,
        new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId(`queue_menu_${author}_music`).addOptions(queue.titles.map((item, i) => new Object({ label: item, value: queue.queue[i], description: client.stof(info.lengthSeconds)})))),
        client.stof(info.lengthSeconds)
    ];
}

client.stof = d => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    return (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm' : '') + (h == 0 ? ' ' + (d - h*3600 - m*60) + 's' : ''); 
}

client.mineGet = async id => {
    var res = {};
    for (let key of ['miningStatus', 'level', 'inventory', 'pickaxe', 'stats', 'backpack', 'discovered']) {
        var value;
            if (!(await client.redis.HEXISTS(`user_${id}`, key))) {
                switch(key.split('mine_').join('')) {
                    case 'level': 
                        value = 0; 
                        await client.redis.HSET(`user_${id}`, key, value);
                    break;
                    case 'miningStatus': 
                        value = {
                            status: 'idle',
                        };
                        await client.redis.HSET(`user_${id}`, key, JSON.stringify(value));
                    break;
                    case 'inventory': 
                        value = []; 
                        await client.redis.HSET(`user_${id}`, key, '');
                    break;
                    case 'pickaxe':
                        value = {
                            name: "finger",
                            type: "pickaxe",
                            description: "The beginnings. The very beginning.",
                            color: "#ffe6a1",
                            consumable: false,
                            level: 0,
                            id: 0,
                            stats: {
                                skill: {
                                    operator: "+",
                                    amount: 1
                                }
                            },
                            unlock: {
                                type: "multiple",
                                types: [
                                    {
                                        type: "drop",
                                        locations: ["generic"]
                                    },
                                    {
                                        type: "start",
                                        level: 0
                                    }
                                ]
                            }
                        }
                        await client.redis.HSET(`user_${id}`, key, JSON.stringify(value));
                    break;
                    case 'stats':
                        value = {
                            health: 10,
                            defense: 0,
                            strength: 1,
                            luck: 1,
                        };
                        await client.redis.HSET(`user_${id}`, key, JSON.stringify(value));
                    break;
                    case 'backpack':
                        value = {
                            item: 'back',
                            total: 10,
                            empty: 10,
                            totalores: 0,
                            totalweight: 0,
                            ores: {}
                        };
                        await client.redis.HSET(`user_${id}`, key, JSON.stringify(value));
                    break;
                    case 'discovered': 
                        value = {
                            traps: [],
                            ores: [],
                            items: ['finger']
                        };
                        await client.redis.HSET(`user_${id}`, key, JSON.stringify(value));
                    break;
                }
            } else
                value = await client.redis.HGET(`user_${id}`, key);
            res[key] = value;
            if (res[key].includes('{"'))
                res[key] = JSON.parse(res[key]);
            if (key == 'inventory' && res.inventory.length > 0)
                res.inventory = res.inventory.split('<->').map(obj => JSON.parse(obj));
    }
    return res;
}

client.mineSet = async (id, obj) => {
    const keys = Object.keys(obj);
    if (keys.includes('inventory'))
        obj.inventory = obj.inventory.map(item => JSON.parse(item)).join('<->');
    else 
        for (let key of ['stats', 'backpack', 'pickaxe', 'discovered'])
            if (keys.includes(key))
                obj[key] == JSON.stringify(obj[key]);
    for (let key of ['level', 'miningStatus', 'inventory', 'pickaxe', 'stats', 'backpack'])
        if (keys.includes(key))
            await client.redis.HSET(`user_${id}`, 'mine_'+key, obj.level);
}

client.caps = text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

client.folders = fs.readdirSync('./commands/');
var commandFiles = [];

client.folders.forEach(folder => fs.readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js')).forEach(async file => {
    commandFiles.push(file);
    const command = await import(`./commands/${folder}/${file}`);
    client.commands.set(command.info.name, command);
    if (command.info.aliases)
        command.info.aliases.forEach(alias => client.aliases.set(alias, command.info.name));
    console.log(`${file} Loaded!`);
}));

console.log(`Loaded all ${commandFiles.length} commands`);

client.once('ready', async () => {
    client.user.setPresence({ activities: [{name: 'fighting people! | ping me for prefix', type: 'PLAYING'}], status: 'online'});
    console.log('ToastBot is finally ready!');
    client.on('messageCreate', async message => {
        if (message.author.bot)
            return;
        if (!(await client.redis.HEXISTS(`guildSpec_${message.guild.id}`, 'prefix')))
            await client.redis.HSET(`guildSpec_${message.guild.id}`, 'prefix', 'toast ');
        const prefix = await client.redis.HGET(`guildSpec_${message.guild.id}`, 'prefix');
        if (message.content.includes(process.env.BOT_ID) && message.content.toLowerCase().includes('reset')) {
            client.redis.HSET(`guildSpec_${message.guildId}`, 'prefix', 'toast ');
            return message.reply('Got it! the prefix has been reset to `toast `!');
        }
        if (message.content.includes(process.env.BOT_ID))
            return message.reply(`My prefix is \`${prefix}\`!`);
        if (/ami|<@839202008048599090>/.test(message.content.toLowerCase()) && message.guildId == '859913455342845982') {
            var ami = client.users.cache.get('839202008048599090');
            ami.send({ embeds: [new MessageEmbed().setColor(client.randToastColor()).setAuthor(message.author.username, message.author.displayAvatarURL({format: 'png'}), message.url).setDescription(message.content).setFooter('Click on their name to teleport to the message!')]});
        }
        var commandName = message.content.replace(prefix, '').split(' ')[0];
        if (commandFiles.includes(client.aliases.get(commandName) + '.js'))
            commandName = client.aliases.get(commandName);
        if (!message.content.startsWith(prefix))
            return;
        const commandObj = client.commands.get(commandName);
        if (!commandObj)
            return;
        if (commandObj.info.cooldown >= 1) {
            if (!client.cooldowns.has(commandName))
                client.cooldowns.set(commandName, new Collection());
            var cooldowns = client.cooldowns.get(commandName);
            if (cooldowns.has(message.author.id)) {
                const time = Date.now() - cooldowns.get(message.author.id);
                if (time / 1000 < commandObj.info.cooldown)
                    return message.reply(`Woah, slow down! You can use \`${prefix}${commandName}\` in **${(commandObj.info.cooldown - (time / 1000)).toString().replace(/(?<=\.[0-9])[0-9]+/, '')}** second(s)!`);
            }
        }
        if (commandObj.info.section == 'admin' && message.author.id != process.env.OWNER_ID)
            return;
        client.cooldowns.get(commandName).set(message.author.id, Date.now());
        message.channel.sendTyping();
        lastCommand.message = message;
        lastCommand.commandObj = commandObj;
        commandObj.run(client, message, message.content.replace(prefix, '').replace(/^(.+?( |$))/, '').split(' ').filter(item => item.length > 0));
    });


    client.on('interactionCreate', async interaction => {
        if (interaction.customId == 'disabled')
            return;
        let props = await import(`./commands/${interaction.customId.split('_').pop()}/${interaction.customId.split('_').shift()}.js`);
        if (!interaction.customId.split('_')[2].split('<->').includes(interaction.user.id) && interaction.customId.split('_')[2] !== 'all')
            return interaction.reply({content: 'This isn\'t your toast!', ephemeral: true});
        if (interaction.isSelectMenu())
            props.menu(client, interaction);
        else if (interaction.isButton())
            props.button(client, interaction);
        else 
            console.log(interaction);
    });

    client.on('messageDelete', message => {if (message.content.length > 3)client.snipe.set(message.guildId, message)}); //snipe command
});

client.login(process.env.TOKEN);