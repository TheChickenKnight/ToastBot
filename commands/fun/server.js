module.exports.info = {
    name: 'server',
    cooldown: 2,
    section: 'fun',
    description: 'start the server!',
    usage: '<`prefix`>server'
};

module.exports.run = async (client, message, args) => {
    const process = require('child_process');   
    var ls = process.spawn('F:/GitHub repos/ToastBot/server/LaunchServer.bat');
    ls.stdout.on('data', (data) => console.log(data));
    ls.stderr.on('data', (data) => console.log(data));
    ls.on('close', function (code) {
        if (code == 0)console.log('Stop');
        else console.log('Start');
    });
};