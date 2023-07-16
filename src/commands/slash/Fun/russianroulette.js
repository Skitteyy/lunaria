const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a 6 sided dice!'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        let options = [
            `${message.author.username} rolled a dice, it landed on 1!`,
            `${message.author.username} rolled a dice, it landed on 2!`,
            `${message.author.username} rolled a dice, it landed on 3!`,
            `${message.author.username} rolled a dice, it landed on 4!`,
            `${message.author.username} rolled a dice, it landed on 5!`,
            `${message.author.username} rolled a dice, it landed on 6!`,
        ]

        let answer = options[Math.floor(Math.random() * options.length)];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.member.user.username} rolls a dice.`)
                    .setDescription(`${answer}`)
                    .setFooter({ text: 'dice roll' })
                    .setTimestamp()
            ],
        });
    }
};
