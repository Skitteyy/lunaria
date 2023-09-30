const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, ButtonBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

const ITEMS_PER_PAGE = 5; // Adjust as needed

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('List your items.'),
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
        });

        if (!economy || !economy.items || economy.items.length === 0) {
            return interaction.reply({
                content: "Your inventory is empty.",
                components: [] // Remove components in this case
            });
        }

        const totalPages = Math.ceil(economy.items.length / ITEMS_PER_PAGE);

        let currentPage = 1;
        let startIdx = 0;
        let endIdx = ITEMS_PER_PAGE;

        const generateEmbed = () => {
            const itemsToDisplay = economy.items.slice(startIdx, endIdx);

            const embed = new EmbedBuilder()
                .setTitle('Inventory')
                .setDescription(`Page ${currentPage}/${totalPages}`)
                .setColor('#White');

            // Add each item as a field
            itemsToDisplay.forEach((item, index) => {
                embed.addFields({ name: `Item ${index + 1}`, value: item, inline: true });
            });

            return embed;
        };

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prevPage')
                    .setLabel('Previous')
                    .setStyle(1), // Use 1 for Primary
                new ButtonBuilder()
                    .setCustomId('nextPage')
                    .setLabel('Next')
                    .setStyle(1) // Use 1 for Primary
            );

        const updateMessage = await interaction.reply({
            embeds: [generateEmbed()],
            components: [buttonRow],
            fetchReply: true,
        });

        const collector = updateMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000, // Set a reasonable time limit for interaction
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'prevPage') {
                if (currentPage > 1) {
                    currentPage--;
                    startIdx -= ITEMS_PER_PAGE;
                    endIdx -= ITEMS_PER_PAGE;
                    await buttonInteraction.update({
                        embeds: [generateEmbed()],
                    });
                }
            } else if (buttonInteraction.customId === 'nextPage') {
                if (currentPage < totalPages) {
                    currentPage++;
                    startIdx += ITEMS_PER_PAGE;
                    endIdx += ITEMS_PER_PAGE;
                    await buttonInteraction.update({
                        embeds: [generateEmbed()],
                    });
                }
            }
        });

        collector.on('end', () => {
            // Handle the collector ending (e.g., cleanup)
        });
    }
};
