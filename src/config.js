module.exports = {
    client: {
        token: '',
        id: ''
    },
    handler: {
        prefix: '*',
        deploy: true,
        commands: {
            prefix: true,
            slash: true,
            user: false,
            message: false
        },
        mongodb: {
            uri: ''
        }
    }
};
