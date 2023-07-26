module.exports = {
    client: {
        token: '',
        id: ''
    },
    handler: {
        prefix: '*',
        logChannel: '',
        deploy: true,
        commands: {
            prefix: true,
            slash: true,
            user: true,
            message: true
        },
        mongodb: {
            uri: 'mongodb+srv://skittey:H9VSvc6ayDd7P5Ko@discordbot.uzwyegb.mongodb.net/'
        }
    }
};
