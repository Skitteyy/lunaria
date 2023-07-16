const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        const row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('coinflip_button')
                    .setLabel('Flip coin')
                    .setStyle(ButtonStyle.Primary)
            );

        let options = [
            `${interaction.member.user.username} flipped a coin, the coin landed on **Heads**!`,
            `${interaction.member.user.username} flipped a coin, the coin landed on **Tails**!`
        ]

        let answer = options[Math.floor(Math.random() * options.length)];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Coin flip')
                    .setDescription(`${answer}`)
                    .setFooter({ text: 'Coin flip' })
                    .setTimestamp()
            ],
        });
    }
};
