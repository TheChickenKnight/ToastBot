const { default: Collection } = require("@discordjs/collection");

module.exports.info = {
    name: 'test',
    section: 'fun',
    description: 'test',
    usage: 'test'
};

module.exports.run = (client, message, args) => {
    client.test = new Collection();
    client.test.set('test', { test: 'test'});
    client.test.get('test').foo = 'bar';
    console.log(JSON.stringify(client.test.get('test')));
}