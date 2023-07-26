const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('eco')
        .setDescription('Economy System.')
        .addSubcommand((subcommand) =>
            subcommand.setName('balance')
                .setDescription('View a user\'s balance.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User whose balance to view.')
                        .setRequired(true)))


        .addSubcommand((subcommand) =>
            subcommand.setName('baladd')
                .setDescription('Adds balance to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add balance to')
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of balance to add')
                        .setRequired(true)))


        .addSubcommand((subcommand) =>
            subcommand.setName('balremove')
                .setDescription('Removes balance from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add balance to')
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName('amount')
                        .setDescription('Amount of balance to add')
                        .setRequired(true))),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')
        const user = interaction.options.getUser('user');
        const subcommand = interaction.options.getSubcommand();
        const amount = interaction.options.getNumber('amount');
        const heads = interaction.options.get('heads');
        const tails = interaction.options.get('tails');

        let data = await EconomySchema.findOne({
            guild: interaction.guildId,
            user: user,
        })

        if (!data) data = await new EconomySchema({
            guild: interaction.guildId,
            user: user,
        })

        data.save();

        if (subcommand === 'balance') {
            if (user.bot) return interaction.reply({
                content: `${user.username} is a bot and can't have a balance!`
            })

            if (!data.balance) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${user.username}'s Balance`)
                            .setDescription(`${user.username} doesn't have a balance!`)
                            .setFooter({ text: 'User balance' })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                })
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${user.username}'s Balance`)
                            .setDescription(`${user.username} has ${Mora} ${data.balance}`)
                            .setFooter({ text: 'User balance' })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                })
            }
        }

        if (subcommand === 'baladd') {
            if (user.bot) return interaction.reply({
                content: `${user.username} is a bot and can't have a balance!`
            })

            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                let data = await EconomySchema.findOne({
                    guild: interaction.guildId,
                    user: user,
                })

                if (!data) data = await new EconomySchema({
                    guild: interaction.guildId,
                    user: user,
                })

                const defaultBalance = data.balance

                data.save();

                let data2 = await EconomySchema.findOneAndUpdate({
                    balance: defaultBalance + amount
                })

                if (!data2) return;

                data2.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Add balance`)
                            .setDescription(`${interaction.member.user.username} added ${amount} coins to ${user.username}.`)
                            .setFooter({ text: 'Add balance' })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                })
            } else {
                await interaction.reply({
                    content: 'You don\'t have permission to do that.'
                });
            }
        }


        if (subcommand === 'balremove') {
            if (user.bot) return interaction.reply({
                content: `${user.username} is a bot and can't have a balance!`
            })

            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                let data = await EconomySchema.findOne({
                    guild: interaction.guildId,
                    user: user,
                })

                if (!data) data = await new EconomySchema({
                    guild: interaction.guildId,
                    user: user,
                })

                const defaultBalance = data.balance

                data.save();

                let data2 = await EconomySchema.findOneAndUpdate({
                    balance: defaultBalance - amount
                })

                if (!data2) return;

                data2.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Remove balance`)
                            .setDescription(`${interaction.member.user.username} removed ${amount} coins from ${user.username}.`)
                            .setFooter({ text: 'Remove balance' })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                })
            } else {
                await interaction.reply({
                    content: 'You don\'t have permission to do that.'
                });
            }
        }

        client.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            let data = await EconomySchema.findOne({
                guild: interaction.guildId,
                user: user,
            })

            if (!data) data = await new EconomySchema({
                guild: interaction.guildId,
                user: user,
            })

            const defaultBalance = data.balance

            data.save();

            let amount = [
                1,
                2,
                3,
                4,
                5
            ]

            let random = Math.floor(Math.random() * amount.length)

            let data2 = await EconomySchema.findOneAndUpdate({
                balance: defaultBalance + random
            })

            data2.save()
        })
    }
};
