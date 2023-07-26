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
        const user = interaction.options.getUser('user');
        const subcommand = interaction.options.getSubcommand();
        const amount = interaction.options.getNumber('amount');

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

        if (subcommand === 'balance') {
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
                            .setDescription(`${user.username} has ${data.balance} coins`)
                            .setFooter({ text: 'User balance' })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                })
            }
        }

        if (subcommand === 'baladd') {
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                let data = await EconomySchema.findOneAndUpdate({
                    balance: defaultBalance + amount
                })

                if (!data) return;

                data.save();

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
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                let data = await EconomySchema.findOneAndUpdate({
                    balance: defaultBalance - amount
                })

                if (!data) return;

                data.save();

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
    }
};
