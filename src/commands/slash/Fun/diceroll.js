const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('russianroulette')
        .setDescription('A magazine of 6, one bullet is loaded. Good luck.'),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        let options = [
            '*click* nothing happened',
            '*click* nothing happened',
            '*click* nothing happened',
            '*click* nothing happened',
            '*click* nothing happened',
            '*peng* youre dead, congrats'
        ]

        let answer = options[Math.floor(Math.random() * options.length)];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.member.user.username} is feeling suicidal.`)
                    .setDescription(`${answer}`)
                    .setFooter({ text: 'Russian roulette' })
                    .setTimestamp()
            ],
        });
    }
};
