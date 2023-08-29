const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');
const TimeSchema = require('../../../schemas/TimeSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('weekly')
        .setDescription('Claim your weekly Mora!')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('choose an action')
                .addChoices(
                    { name: 'claim', value: 'claim' },
                    { name: 'check', value: 'check' }
                )
                .setRequired(true)),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const nextWeeklyDate = new Date(currentDate)
        nextWeeklyDate.setDate(currentDate.getDate() + 7);

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

        let weekly = await TimeSchema.findOne({
            guild: interaction.guildId,
            user: interaction.user.username,
            lastWeekly: {
                $exists: true
            },
            nextWeekly: {
                $exists: true
            }
        });

        switch (interaction.options.getString('action')) {
            case 'claim': {
                if (weekly) {
                    if (weekly.lastWeekly.toISOString() !== currentDate.toISOString()) {
                        let embed = new EmbedBuilder()
                            .setTitle(`Weekly Mora`)
                            .setDescription(`Here is your weekly 25000 Mora ${Mora}.`)
                            .setFooter({ text: 'Weekly claim' })
                            .setColor('#FFBEEF')
                            .setTimestamp();

                        interaction.reply({
                            embeds: [embed]
                        });

                        await EconomySchema.find({
                            guild: interaction.guildId,
                            user: interaction.user.username
                        }).updateOne({
                            balance: balance + 25000
                        })

                        await TimeSchema.findOneAndUpdate(
                            { guild: interaction.guildId, user: interaction.user.username },
                            { lastWeekly: currentDate, nextWeekly: nextWeeklyDate }
                        );

                        return;
                    } else {
                        let embed = new EmbedBuilder()
                            .setTitle(`Weekly Mora`)
                            .setDescription(`You already claimed your weekly Mora ${Mora} this week. Use \`\`\`/weekly check\`\`\` to see when you can claim it next.`)
                            .setFooter({ text: 'Weekly claim' })
                            .setColor('#FFBEEF')
                            .setTimestamp();

                        interaction.reply({
                            embeds: [embed]
                        });

                        return;
                    }
                } else {
                    weekly = new TimeSchema({
                        guild: interaction.guildId,
                        user: interaction.user.username,
                        lastWeekly: currentDate,
                        nextWeekly: nextWeeklyDate
                    });
                    await weekly.save();

                    await interaction.reply({
                        content: `An error occured. Please try again.`
                    })
                    return;
                }
            }

            case 'check': {
                if (weekly) {
                    if (weekly.lastWeekly.toISOString() !== currentDate.toISOString()) {
                        let embed = new EmbedBuilder()
                            .setTitle(`Weekly Mora`)
                            .setDescription(`Your daily Mora ${Mora} is ready to be claimed.`)
                            .setFooter({ text: 'Weekly check' })
                            .setColor('#FFBEEF')
                            .setTimestamp();

                        interaction.reply({
                            embeds: [embed]
                        });

                        return;
                    } else {
                        const nextWeeklyTime = new Date(weekly.nextWeekly);
                        const botTime = new Date();

                        const duration = Math.floor((nextWeeklyTime - botTime) / 1000);

                        const days = Math.floor(duration / 86400);
                        const hours = Math.floor((duration % 86400) / 3600);
                        const minutes = Math.floor((duration % 3600) / 60);
                        const seconds = duration % 60;
                        const remainingTime = `${days}d ${hours}h ${minutes}m ${seconds}s`

                        let embed = new EmbedBuilder()
                            .setTitle(`Weekly Mora`)
                            .setDescription(`Your weekly Mora ${Mora} can be claimed again in ${remainingTime}.`)
                            .setFooter({ text: 'Weekly check' })
                            .setColor('#FFBEEF')
                            .setTimestamp();

                        interaction.reply({
                            embeds: [embed]
                        });

                        return;
                    }
                } else {
                    weekly = new TimeSchema({
                        guild: interaction.guildId,
                        user: interaction.user.username,
                        lastWeekly: currentDate,
                        nextWeekly: nextWeeklyDate
                    });
                    await weekly.save();

                    await interaction.reply({
                        content: `An error occured. Please try again.`
                    })
                    return;
                }
            }
        }
    }
};
