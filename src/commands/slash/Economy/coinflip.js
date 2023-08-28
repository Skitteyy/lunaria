const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ecocoinflip')
        .setDescription('Bet money on heads or tails')
        .addStringOption(option =>
            option.setName('outcome')
                .setDescription('choose an outcome')
                .addChoices(
                    { name: 'heads', value: 'heads' },
                    { name: 'tails', value: 'tails' }
                )
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('choose an amount to bet')
                .setRequired(true)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {

        const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')

        let economy = await EconomySchema.findOne({
            guild: interaction.guildId,
            user: interaction.member.user.username
        })

        if (!economy) {
            interaction.reply({
                content: 'You need to create an economy account first. Use ```/economy create``` to create an economy account.'
            })
            return
        }

        let balance = economy.balance

        const outcome = interaction.options.getString('outcome');
        const amount = interaction.options.getNumber('amount');

        if (amount > balance) {
            interaction.reply({
                content: `Your current balance is ${balance} Mora ${Mora}. You can't bet ${amount} Mora ${Mora}.`
            })
            return;
        }

        if (amount <= 0 || amount > 100000) {
            interaction.reply({
                content: `The amount should be between 1 and 100000 Mora ${Mora}.`
            })
            return;
        }

        const outcomes = [
            'heads',
            'tails'
        ];

        const randomOutcome = Math.floor(Math.random() * outcomes.length);

        if (outcome === 'heads') {
            if (randomOutcome === 0) {
                let embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username} bets on a coinflip`)
                    .setDescription(`You bet ${amount} Mora ${Mora} on heads. The coin landed on heads!\nResult: + ${amount} Mora ${Mora}`)
                    .setFooter({ text: 'Coinflip' })
                    .setColor('#FFBEEF');

                await interaction.reply({
                    embeds: [embed]
                });

                await EconomySchema.find({
                    guild: interaction.guildId,
                    user: interaction.member.user.username
                }).updateOne({
                    balance: balance + amount
                })
                return;
            }

            if (randomOutcome === 1) {
                let embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username} bets on a coinflip`)
                    .setDescription(`You bet ${amount} Mora ${Mora} on heads. The coin landed on tails!\nResult: - ${amount} Mora ${Mora}`)
                    .setFooter({ text: 'Coinflip' })
                    .setColor('#FFBEEF');

                await interaction.reply({
                    embeds: [embed]
                });

                await EconomySchema.find({
                    guild: interaction.guildId,
                    user: interaction.member.user.username
                }).updateOne({
                    balance: balance - amount
                })
                return;
            }
        }

        if (outcome === 'tails') {
            if (randomOutcome === 0) {
                let embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username} bets on a coinflip`)
                    .setDescription(`You bet ${amount} Mora ${Mora} on tails. The coin landed on heads!\nResult: - ${amount} Mora ${Mora}`)
                    .setFooter({ text: 'Coinflip' })
                    .setColor('#FFBEEF');

                await interaction.reply({
                    embeds: [embed]
                });

                await EconomySchema.find({
                    guild: interaction.guildId,
                    user: interaction.member.user.username
                }).updateOne({
                    balance: balance - amount
                })
                return;
            }

            if (randomOutcome === 1) {
                let embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username} bets on a coinflip`)
                    .setDescription(`You bet ${amount} Mora ${Mora} on tails. The coin landed on tails!\nResult: + ${amount} Mora ${Mora}`)
                    .setFooter({ text: 'Coinflip' })
                    .setColor('#FFBEEF');

                await interaction.reply({
                    embeds: [embed]
                });

                await EconomySchema.find({
                    guild: interaction.guildId,
                    user: interaction.member.user.username
                }).updateOne({
                    balance: balance + amount
                })
                return;
            }
        }
    }
};
