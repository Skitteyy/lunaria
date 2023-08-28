const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Message, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('manage your economy account')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('choose an action')
                .addChoices(
                    { name: 'create', value: 'create' },
                    { name: 'delete', value: 'delete' },
                    { name: 'leaderboard', value: 'leaderboard' }
                )
                .setRequired(true)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        let economy = await EconomySchema.findOne({
            guild: interaction.guildId,
            user: interaction.member.user.username
        })

        switch (interaction.options.getString('action')) {
            case 'create': {
                if (economy) {
                    await interaction.reply({
                        content: 'You already have an economy account.'
                    })
                    return;
                } else {
                    economy = await new EconomySchema({
                        guild: interaction.guildId,
                        user: interaction.member.user.username,
                        job: 'unemployed'
                    }).save()

                    await interaction.reply({
                        content: 'You have successfully created an economy account.'
                    })
                    return;
                }
            }

            case 'delete': {
                if (economy) {
                    await EconomySchema.deleteOne({
                        guild: interaction.guildId,
                        user: interaction.member.user.username,
                        job: {
                            $exists: true
                        },
                        items: {
                            $exists: true
                        }
                    })

                    await interaction.reply({
                        content: 'Your economy account for this server has been successfully deleted.'
                    })
                    return;
                } else {
                    await interaction.reply({
                        content: 'You don\'t have an economy account to delete.'
                    })
                    return;
                }
            }

            case 'leaderboard': {
                const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')

                const users = await EconomySchema.find({
                    guild: interaction.guildId,
                    user: {
                        $exists: true
                    }
                });
                
                const sorted = users.sort((a, b) => {
                    return b.balance - a.balance;
                }).slice(0, 10);
                
                const list = sorted.map((user, index) => {
                    return `${index + 1}. ${user.user}: ${user.balance} ${Mora}`;
                }).join('\n');
                
                let embed = new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} Leaderboard`)
                    .setDescription(list)
                    .setFooter({ text: 'Server Leaderboard' })
                    .setColor('#FFBEEF')

                return interaction.reply({
                    embeds: [embed]
                })
            }
        }
    }
};
