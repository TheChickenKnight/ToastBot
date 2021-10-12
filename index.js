const { Client, Intents, Collection, MessageEmbed, MessageAttachment, MessageSelectMenu, MessageActionRow } = require("discord.js");
const fs = require('fs'), db = require('quick.db'), dotenv = require("dotenv");
dotenv.config();

const client = new Client({ws: { properties: { $browser: "Discord iOS"}}, intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS ]});

console.log(`Welcome to ToastBot's Console!`);

client.commands = new Collection(), client.aliases = new Collection(), client.cooldowns = new Collection(), client.timeIDs = new Collection(), client.snipe = new Collection(), client.tictactoe = new Collection(), client.toasterbreadmilk = new Collection();

client.randToastColor = () => ['#ffe6cc', '#996600', '#ffdd99', '#663300', '#331a00'][Math.floor(Math.random() * 5)];
client.fight = (obj) => {
    const boss = require('./commands/rpg/boss.json').bosses[obj.id];
    return [new MessageEmbed().setDescription(boss.description).setTitle(`FIGHT!\tBoss Number ${obj.id+1}`).setImage(`attachment://${obj.id}.png`).setColor(boss.color).addField(boss.name, `**Attack per second:** ${Math.round(Math.pow(obj.id + 2, 6) / 10)}\n**Defense:** ${Math.round(Math.pow(obj.id + 2, 5.978) / 10)}\n**HP:** ${obj.hp || Math.pow(obj.id + 2, 6)}`, true), new MessageAttachment().setFile(`./Images/bosses/${obj.id}.png`), { hp: Math.pow(obj.id + 2, 6), def: Math.round(Math.pow(obj.id + 2, 5.978) / 10), att: Math.round(Math.pow(obj.id + 2, 6) / 10)}];
}
var sections = [
    {
        boss: -1,
        option: {
            label: 'Training',
            description: 'Get Stronger! kinda slow tho',
            value: 'train'
        }
    },
    {
        boss: -1,
        option: {
            label: 'Fight!',
            value: 'fight',
            description: 'get em I guess'
        }
    },
    {
        boss: 2,
        option: {
            label: 'Pet',
            value: 'pet',
            description: 'Take care of your pet!'
        }
    }
]
client.rpgmenu = (id, currSection, author) => {
    var menu = new MessageSelectMenu().setCustomId(`rpg_menu_${author}_rpg`);
    sections.forEach(section => {
        section.option.default = currSection == section.option.value;
        if (section.boss < id)menu.addOptions(section.option);
    });
    return new MessageActionRow().addComponents(menu);
}

client.folders = fs.readdirSync('./commands/');
var commandFiles = [];

client.folders.forEach(folder => fs.readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js')).forEach(file => {
    commandFiles.push(file);
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.info.name, command);
    if (command.info.aliases)command.info.aliases.forEach(alias => client.aliases.set(alias, command.info.name));
    console.log(`${file} Loaded!`);
}));

console.log(`Loaded all ${commandFiles.length} command(s)`);

client.once('ready', () => {

    client.user.setPresence({ activities: [{name: 'games on my phone', type: 'PLAYING'}], status: 'online'});

    console.log(`ToastBot is finally ready!`);

    client.on('messageCreate', async message => {
        if (!db.has(`guildSpec.${message.guildId}.prefix`))db.set(`guildSpec.${message.guildId}.prefix`, 'toast ');
        const prefix = db.get(`guildSpec.${message.guildId}.prefix`);
        if (new RegExp("/.*<@(!|)" + process.env.BOT_ID + ">.*/").test(message.content) && message.content.toLowerCase().includes('reset')) {
            db.set(`guildSpec.${message.guildId}.prefix`, 'toast ');
            return message.reply('Got it! the prefix has been reset to `toast `!');
        }
        if (new RegExp("/.*<@(!|)" + process.env.BOT_ID + ">.*/").test(message.content))return message.reply(`My prefix is \`${prefix}\`!`);
        if (/ami|<@839202008048599090>/.test(message.content.toLowerCase()) && message.guildId == "859913455342845982") {
            var ami = await client.users.cache.get('839202008048599090');
            ami.send({ embeds: [new MessageEmbed().setColor(client.randToastColor()).setAuthor(message.author.username, message.author.displayAvatarURL({format: 'png'}), message.url).setDescription(message.content).setFooter('Click on their name to teleport to the message!')]});
        }
        if (message.author.bot)return;
        var commandName = message.content.replace(prefix, '').split(' ')[0];
        if (commandFiles.includes(client.aliases.get(commandName) + '.js'))commandName = client.aliases.get(commandName);
        if (!commandFiles.includes(commandName + '.js'))return /(^| )t(| )o(| )a(| )s(| )t($| |\?|\.|\;|\:|\,|\))/.test(message.content.toLowerCase()) && message.author.id != 873255148338688060 ? message.channel.send('Did someone say toast?') : '';
        if (!message.content.startsWith(prefix))return;
        const commandObj = client.commands.get(commandName);
        if (commandObj.info.cooldown >= 1) {
            if (!client.cooldowns.has(commandName))client.cooldowns.set(commandName, new Collection());
            var cooldowns = client.cooldowns.get(commandName);
            if (cooldowns.has(message.author.id)) {
                const time = Date.now() - cooldowns.get(message.author.id);
                if (time / 1000 < commandObj.info.cooldown)return message.reply(`Woah, slow down! You can use \`${prefix}${commandName}\` in **${(commandObj.info.cooldown - (time / 1000)).toString().replace(/(?<=\.[0-9])[0-9]+/, '')}** second(s)!`);
            }
        }
        if (commandObj.info.section == 'admin' && message.author.id != process.env.OWNER_ID)return;
        client.cooldowns.get(commandName).set(message.author.id, Date.now());
        message.channel.sendTyping();
        commandObj.run(client, message, message.content.replace(prefix, '').replace(/^(.+?( |$))/, '').split(' ').filter(item => item.length > 0));
    });


    client.on('interactionCreate', interaction => {
        if (interaction.customId == 'disabled')return;
        let props = require(`./commands/${interaction.customId.split('_').pop()}/${interaction.customId.split('_').shift()}.js`);
        if (!interaction.customId.split('_')[2].split('<->').includes(interaction.user.id))return interaction.reply({content: 'This isn\'t your toast!', ephemeral: true});
        if (interaction.isSelectMenu())props.menu(client, interaction);
        else if (interaction.isButton())props.button(client, interaction);
        else console.log(interaction);
    });

    client.on('messageDelete', message => {if (message.content.length > 3)client.snipe.set(message.guildId, message)}); //snipe command
});

client.login(process.env.TOKEN);