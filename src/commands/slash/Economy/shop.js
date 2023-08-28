const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MentionableSelectMenuBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('List and buy available items.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('choose an action')
                .addChoices(
                    { name: 'list', value: 'list' },
                    { name: 'buy', value: 'buy' }
                )
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

        switch (interaction.options.getString('action')) {
            case 'list': {
                if (!economy) {
                    interaction.reply({
                        content: 'You need to create an economy account first. Use ```/economy create``` to create an economy account.'
                    })
                    return
                } else {
                    let embed = new EmbedBuilder()
                        .setTitle('Available Items list')
                        .addFields(
                            { name: 'Fishing Rod', value: `A tool used by fishermen to catch fish. Price: 300 Mora ${Mora}` },
                            { name: 'Shovel', value: `A tool used by archeologists to dig up relics. Price: 300 Mora ${Mora}` },
                            { name: 'Axe', value: `A tool used by hunters to hunt wildlife. Price: 300 Mora ${Mora}` }
                        )
                        .setFooter({ text: 'Items list' })
                        .setColor('#FFBEEF');

                    await interaction.reply({
                        embeds: [embed]
                    });
                    return;
                }
            }

            case 'buy': {
                if (!economy) {
                    interaction.reply({
                        content: 'You need to create an economy account first. Use ```/economy create``` to create an economy account.'
                    })
                    return
                } else {
                    const choices = [
                        'fishing rod',
                        'shovel',
                        'axe'
                    ]

                    let embed = new EmbedBuilder()
                        .setTitle(`Select an item to buy`)
                        .setDescription('Please select an item.')
                        .setFooter({ text: 'Job info' })
                        .setColor('#FFBEEF');

                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('items')
                        .setPlaceholder('select an item')
                        .addOptions(choices.map(choice => ({
                            label: choice,
                            value: choice.toLowerCase(),
                        })));

                    const row = new ActionRowBuilder()
                        .addComponents(selectMenu);

                    await interaction.reply({
                        embeds: [embed],
                        components: [row],
                        ephemeral: true
                    });

                    const filter = i => i.user.id === interaction.user.id

                    const collector = interaction.channel.createMessageComponentCollector({
                        filter: filter,
                        componentType: ComponentType.StringSelect,
                        max: 1
                    })

                    collector.on('collect', async (option) => {
                        const jobList = await EconomySchema.find({
                            guild: interaction.guildId,
                            user: interaction.user.username,
                            job: {
                                $exists: true
                            }
                        })

                        const job = jobList.map(doc => doc.job);

                        const choice = option.values[0];

                        const hasItem = economy.items.find(item => item === choice)

                        if (economy.balance < 300) {
                            interaction.editReply({
                                content: `You have ${economy.balance} Mora ${Mora}. You need 300 Mora ${Mora} to buy this item.`,
                                embeds: [],
                                components: []
                            })
                            return;
                        }

                        if (hasItem) return interaction.editReply({
                            content: `You can't have more than one ${choice}.`,
                            embeds: [],
                            components: []
                        })

                        if (job.includes('fisherman')) {
                            if (!choice.includes('fishing rod')) {
                                interaction.editReply({
                                    content: `You are working as a fisherman and can only buy a fishing rod.`,
                                    embeds: [],
                                    components: []
                                })
                                return;
                            }

                            await EconomySchema.find({
                                guild: interaction.guildId,
                                user: interaction.user.username,
                                job: 'fisherman'
                            }).updateOne({
                                balance: economy.balance - 300,
                                $push: {
                                    items: choice
                                }
                            })

                            await interaction.followUp({
                                content: `You have successfully bought 1 ${choice} for 300 Mora ${Mora}!`,
                                embeds: [],
                                components: []
                            });
                            return;
                        }

                        if (job.includes('archeologist')) {
                            if (!choice.includes('shovel')) {
                                interaction.editReply({
                                    content: `You are working as an archeologist and can only buy a shovel.`,
                                    embeds: [],
                                    components: []
                                })
                                return;
                            }

                            await EconomySchema.find({
                                guild: interaction.guildId,
                                user: interaction.user.username,
                                job: 'archeologist'
                            }).updateOne({
                                balance: economy.balance - 300,
                                $push: {
                                    items: choice
                                }
                            })

                            await interaction.followUp({
                                content: `You have successfully bought 1 ${choice} for 300 Mora ${Mora}!`,
                                embeds: [],
                                components: []
                            });
                            return;
                        }

                        if (job.includes('hunter')) {
                            if (!choice.includes('axe')) {
                                interaction.editReply({
                                    content: `You are working as a hunter and can only buy an axe.`,
                                    embeds: [],
                                    components: []
                                })
                                return;
                            }

                            await EconomySchema.find({
                                guild: interaction.guildId,
                                user: interaction.user.username,
                                job: 'hunter'
                            }).updateOne({
                                balance: economy.balance - 300,
                                $push: {
                                    items: choice
                                }
                            })

                            await interaction.followUp({
                                content: `You have successfully bought 1 ${choice} for 300 Mora ${Mora}!`,
                                embeds: [],
                                components: []
                            });
                            return;
                        }
                    })
                }
            }

                break;
        }
    }
};
