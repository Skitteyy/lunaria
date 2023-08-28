const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('removebalance')
        .setDescription('Remove Mora from a user\'s balance')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User whom to remove Mora from')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('Amount of Mora to remove')
                .setRequired(true)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')
        const user = interaction.options.getUser('user').username;
        const amount = interaction.options.getNumber('amount');

        let economy = await EconomySchema.findOne({
            guild: interaction.guildId,
            user: user
        })

        if (!economy) {
            interaction.reply({
                content: 'This user needs to create an economy account first. Use ```/economy create``` to create an economy account.'
            })
            return
        }

        let balance = economy.balance;

        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {

            if (balance - amount < 0) {
                interaction.reply({
                    content: `${user} doesn\'t have this much Mora ${Mora}!`
                })
                return
            }

            if (amount <= 0) {
                interaction.reply({
                    content: 'The amount should be at least 1.'
                })
                return;
            }

            await EconomySchema.find({
                guild: interaction.guildId,
                user: user
            }).updateOne({
                balance: balance - amount
            })

            let embed = new EmbedBuilder()
                .setTitle(`Removed Mora from ${user}!`)
                .setDescription(`Successfully removed ${amount} Mora ${Mora} from ${user}!`)
                .setFooter({ text: 'Remove Balance' })
                .setColor('#FFBEEF')

            interaction.reply({
                embeds: [embed]
            })
        } else {
            await interaction.reply({
                content: 'You don\'t have permission to do that.'
            })
        }
    }
};
