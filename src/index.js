const { EmbedBuilder } = require('discord.js');
const GuildSchema = require('./schemas/GuildSchema');
const EconomySchema = require('./schemas/EconomySchema');

var cooldown = [];


require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');

const client = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.on('messageCreate', async (message) => {
    let economy = await EconomySchema.findOne({
        guild: message.guildId,
        user: message.author.username
    });

    let balance = economy.balance;

    if (cooldown.includes(message.author.id)) return;

    if (!economy) return;

    const randomAmount = Math.floor(Math.random() * 10) + 1;

    const updatedBalance = balance + randomAmount;

    await EconomySchema.find({
        guild: message.guildId,
        user: message.author.username
    }).updateOne({
        balance: updatedBalance
    })

    cooldown.push(interaction.member.user.id);
    setTimeout(() => {
        cooldown.shift();
    }, 30 * 1000);
});

client.on('messageDelete', async (message) => {
    let data = await GuildSchema.findOne({ guild: message.guildId });

    if (!data) data = new GuildSchema({
        guild: message.guildId
    });

    const channel = message.guild.channels.cache.get(data.logChannel);

    if (message.channel === channel) return;

    if (!channel) return;

    if (message.author.bot) return;

    if (message.content || message.attachments.size > 0) {
        const embed = new EmbedBuilder()
            .setTitle('Message deleted')
            .addFields(
                { name: 'Author', value: `<@${message.member.user.id}>` },
                { name: 'Channel', value: `<#${message.channelId}>` }
            )
            .setFooter({ text: `Message deletion` })
            .setTimestamp()
            .setColor('Red')

        if (message.content) {
            embed.addFields(
                { name: 'Message', value: `"${message.content}"` }
            )
        }

        if (message.attachments.size > 0) {
            const attachment = message.attachments.map(attachment => attachment.url)
            embed.addFields(
                { name: 'Media', value: `"${attachment.join('", "')}"` }
            )
        }

        await channel.send({
            embeds: [embed]
        })
    }
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let data = await GuildSchema.findOne({ guild: newMessage.guildId });

    if (!data) data = new GuildSchema({
        guild: newMessage.guildId
    });

    const channel = newMessage.guild.channels.cache.get(data.logChannel);

    if (newMessage.channel === channel) return;

    if (!channel) return;

    if (oldMessage.author.bot || newMessage.author.bot) return;

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Message edited')
                .addFields(
                    { name: 'Author', value: `<@${newMessage.member.user.id}>` },
                    { name: 'Channel', value: `<#${newMessage.channelId}>` },
                    { name: 'Message ID', value: `${oldMessage.id}` },
                    { name: 'Before:', value: `"${oldMessage.content}"` },
                    { name: 'After:', value: `"${newMessage.content}"` }
                )
                .setFooter({ text: `Message edit` })
                .setTimestamp()
                .setColor('Blue')
        ]
    })
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    let data = await GuildSchema.findOne({ guild: newMember.guild.id });

    if (!data) data = new GuildSchema({
        guild: newMember.guild.id
    });

    const channel = newMember.guild.channels.cache.get(data.logChannel);

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        oldMember.roles.cache.forEach(role => {
            if (!newMember.roles.cache.has(role.id)) {

                if (!channel) return;

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Role updated')
                            .addFields(
                                { name: 'Member', value: `<@${newMember.user.id}>` },
                                { name: 'Role removed:', value: `${role}` }
                            )
                            .setFooter({ iconURL: `${oldMember.displayAvatarURL()}`, text: `${oldMember.user.username}` })
                            .setTimestamp()
                            .setColor('Red')
                    ]
                });
            }
        });
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {

                if (!channel) return;

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Role updated')
                            .addFields(
                                { name: 'Member', value: `<@${newMember.user.id}>` },
                                { name: 'Role added:', value: `${role}` }
                            )
                            .setFooter({ iconURL: `${oldMember.displayAvatarURL()}`, text: `${oldMember.user.username}` })
                            .setTimestamp()
                            .setColor('Green')
                    ]
                });
            }
        })
    }

    if (oldMember.nickname !== newMember.nickname) {
        if (!channel) return;

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Nickname updated')
                    .addFields(
                        { name: 'Old Nickname:', value: `${oldMember.nickname || oldMember.user}` },
                        { name: 'New Nickname:', value: `${newMember.nickname || newMember.user}` }
                    )
                    .setFooter({ iconURL: `${oldMember.displayAvatarURL()}`, text: `${oldMember.user.username}` })
                    .setTimestamp()
                    .setColor('Green')
            ]
        });
    }
});

client.on('guildMemberRemove', async member => {
    let data = await GuildSchema.findOne({ guild: member.guild.id });

    if (!data) data = new GuildSchema({
        guild: member.guild.id
    });

    const channel = member.guild.channels.cache.get(data.logChannel);

    if (!channel) return;

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Member left')
                .setThumbnail(member.displayAvatarURL({
                    size: 1024
                }))
                .addFields(
                    { name: 'Member', value: `<@${member.user.id}> (${member.user.tag})` },
                    { name: 'Joined on', value: `${member.joinedAt.toDateString()}` },
                    { name: 'Created on', value: `${member.user.createdAt.toDateString()}` },
                    { name: `Roles [${member.roles.cache.size}]`, value: `${member.roles.cache.map(role => role).join(", ")}` }
                )
                .setFooter({ iconURL: `${member.displayAvatarURL()}`, text: `${member.user.username}` })
                .setTimestamp()
                .setColor('Red')
        ]
    })
});

client.on('guildMemberAdd', async member => {
    let data = await GuildSchema.findOne({ guild: member.guild.id });

    if (!data) data = new GuildSchema({
        guild: member.guild.id
    });

    const channel = member.guild.channels.cache.get(data.logChannel);

    if (!channel) return;

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Member joined')
                .setThumbnail(member.displayAvatarURL({
                    size: 1024
                }))
                .addFields(
                    { name: 'Member', value: `<@${member.user.id}> (${member.user.tag})` },
                    { name: 'Created on', value: `${member.user.createdAt.toDateString()}` }
                )
                .setFooter({ iconURL: `${member.displayAvatarURL()}`, text: `${member.user.username}` })
                .setTimestamp()
                .setColor('Green')
        ]
    })
});