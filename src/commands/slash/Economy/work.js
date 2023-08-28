const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const EconomySchema = require('../../../schemas/EconomySchema');

var cooldown = [];

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for 500-1500 Mora'),
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

        if (cooldown.includes(interaction.member.user.id)) {
            interaction.reply({
                content: 'This command has a 30 minute cooldown.'
            })
            return;
        }

        if (!economy) {
            interaction.reply({
                content: 'You need to create an economy account first. Use ```/economy create``` to create an economy account.'
            })
            return
        } else {
            const Mora = client.emojis.cache.find(emoji => emoji.id === '1133766383784710325')

            let balance = economy.balance

            let job = economy.job

            const randomAmount = 500 + Math.floor(Math.random() * 1001)

            const fisherman = `You fish a workday long and get paid ${randomAmount} Mora ${Mora}.`

            const archeologist = `You dig up expensive ancient relics and sell them for ${randomAmount} Mora ${Mora}.`

            const hunter = `You hunt animals and get ${randomAmount} Mora ${Mora} for your work.`

            if (job.startsWith('unemployed')) {
                interaction.reply({
                    content: 'You need to apply for a job first. Use ```/job apply``` to apply for a job.'
                })
                return
            } else {
                var answer;

                if (economy.job.startsWith('fisherman')) {
                    const hasItem = economy.items.find(item => item === 'fishing rod')

                    if (!hasItem) {
                        interaction.reply({
                            content: 'You can only work your job as a fisherman if you have a fishing rod. Buy one using ```/shop buy```'
                        })
                    } else {
                        answer = fisherman

                        const updatedBalance = balance + randomAmount;

                        await EconomySchema.find({
                            guild: interaction.guildId,
                            user: interaction.member.user.username
                        }).updateOne({
                            balance: updatedBalance
                        })

                        let embed = new EmbedBuilder()
                            .setTitle('You work your job')
                            .setDescription(answer)
                            .setFooter({ text: 'Job work' })
                            .setColor('#FFBEEF');

                        await interaction.reply({
                            embeds: [embed]
                        });

                        cooldown.push(interaction.member.user.id);
                        setTimeout(() => {
                            cooldown.shift();
                        }, 1800 * 1000);
                    }
                }

                if (economy.job.startsWith('archeologist')) {
                    const hasItem = economy.items.find(item => item === 'shovel')

                    if (!hasItem) {
                        interaction.reply({
                            content: 'You can only work your job as an archeologist if you have a shovel. Buy one using ```/shop buy```'
                        })
                    } else {
                        answer = archeologist

                        const updatedBalance = balance + randomAmount;

                        await EconomySchema.find({
                            guild: interaction.guildId,
                            user: interaction.member.user.username
                        }).updateOne({
                            balance: updatedBalance
                        })

                        let embed = new EmbedBuilder()
                            .setTitle('You work your job')
                            .setDescription(answer)
                            .setFooter({ text: 'Job work' })
                            .setColor('#FFBEEF');

                        await interaction.reply({
                            embeds: [embed]
                        });

                        cooldown.push(interaction.member.user.id);
                        setTimeout(() => {
                            cooldown.shift();
                        }, 1800 * 1000);
                    }
                }

                if (economy.job.startsWith('hunter')) {
                    const hasItem = economy.items.find(item => item === 'axe')

                    if (!hasItem) {
                        interaction.reply({
                            content: 'You can only work your job as a hunter if you have an axe. Buy one using ```/shop buy```'
                        })
                    } else {
                        answer = hunter

                        const updatedBalance = balance + randomAmount;

                        await EconomySchema.find({
                            guild: interaction.guildId,
                            user: interaction.member.user.username
                        }).updateOne({
                            balance: updatedBalance
                        })

                        let embed = new EmbedBuilder()
                            .setTitle('You work your job')
                            .setDescription(answer)
                            .setFooter({ text: 'Job work' })
                            .setColor('#FFBEEF');

                        await interaction.reply({
                            embeds: [embed]
                        });

                        cooldown.push(interaction.member.user.id);
                        setTimeout(() => {
                            cooldown.shift();
                        }, 1800 * 1000);
                    }
                }
            }

            if (job.startsWith('unemployed') || job.startsWith('')) {
                return
            }
        }
    }
};