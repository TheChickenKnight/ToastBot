export const info = {
    name: 'pokedex',
    aliases: ['dex'],
    cooldown: 2,
    section: 'pokemon',
    description: 'Let\'s you find pokemon!',
    usage: 'not yet'
}

import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
var pokemons;
fetch('https://pokeapi.co/api/v2/pokemon/?limit=10220')
    .then(res => res.json())
    .then(res => pokemons = res.results);
function isForms(object) {
    return object.filter(pokemon => pokemon.name)
}

export async function run(client, message, args) {
    if (!args[0])
        return client.error(message, 'You have to specify a Pokemon!');
    if (/(mega|gmax|galar|totem|alola|(fe|)male)/i.test(args[0].toLowerCase()) && args[1])
        args[0] = `${args[1]}-${args[0]}`;
    const object = pokemons.filter(species => species.name.includes(args[0]));
    var embed = new MessageEmbed().setColor(client.randToastColor());
    if (!object.length)
        embed.setColor("#ff0000").setTitle(args[0]).setDescription('Your search isn\'t included in my database.');
    else if (object.length == 1 || isForms(object)) {
        var pokemon, species; 
        await fetch(object[0].url).then(res => res.json()).then(res => pokemon = res);
        await fetch(pokemon.species.url).then(res => res.json()).then(res => species = res);
        const flavorTexts = species.flavor_text_entries.filter(entry => entry.language.name == 'en');
        const types = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1));
        const stats = pokemon.stats.map(stat => { 
            return {
                name: (stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)).replace('-', ' '), 
                stat: stat.base_stat
            }
        });
        embed
            .setTitle(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1))
            .setDescription(`**A ${types.join(' and ')} Type Pokemon**\n\n${flavorTexts[Math.floor(Math.random() * flavorTexts.length)].flavor_text}\n\n**Height⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Weight**\n${(pokemon.height / 10).toString()} m⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${(pokemon.weight / 10).toString()} kg`)
            .setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`);
        var description = '';
        stats.forEach(stat => {
            var bar = '`';
            for (let i = 0; i < (stat.stat / 255) * 10; i++)bar += '◻️';
            for (let i = 0; i < 10 - ((stat.stat / 255) * 10); i++)bar += '◼️';
            bar += '`';
            description += `${bar} - [${stat.name}](https://www.youtube.com/c/TheCodingTrain)\n`;
        });
        embed.addField('** **', description, true);
        if (pokemon.sprites.other['official-artwork'].front_default)embed.setThumbnail(pokemon.sprites.other['official-artwork'].front_default);
        if (pokemon.sprites.versions['generation-v']['black-white'].animated.front_default)embed.setThumbnail(pokemon.sprites.versions['generation-v']['black-white'].animated.front_default);
    } else if (object) {
        var results;
        object.forEach((pokemon, i) => results += `${i+1}. ${pokemon.name.split('-').join(' ')}\n\n`); 
        embed.setTitle('Multiple Results:').setDescription(results.replace('undefined', ''));
    }
    message.reply({content: client.tips(), embeds: [embed]});
}