const { EmbedBuilder, } = require('discord.js');
require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const GuildSchema = require('./schemas/GuildSchema');
const config = require('../config');

const client = new ExtendedClient();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.on('messageDelete', async (message) => {
    let data = await GuildSchema.findOne({ guild: message.guildId });

    if (!data) data = new GuildSchema({
        guild: message.guildId
    });

    const channel = message.guild.channels.cache.get(data.logChannel);

    if (message.channel === channel) return;

    if (!channel) {
        console.log(`${data.guild} does not have a logs channel.`)
        return;
    }

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Deleted')
                .addFields(
                    { name: 'Author', value: `<@${message.member.user.id}>` },
                    { name: 'Channel', value: `<#${message.channelId}>` },
                    { name: 'Message content', value: `"${message.content}"` }
                )
                .setFooter({ text: `Message deletion` })
                .setTimestamp()
                .setColor('#FFBEEF')
        ]
    })
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let data = await GuildSchema.findOne({ guild: newMessage.guildId });

    if (!data) data = new GuildSchema({
        guild: newMessage.guildId
    });

    const channel = newMessage.guild.channels.cache.get(data.logChannel);

    if (newMessage.channel === channel) return;

    if (!channel) {
        console.log(`${data.guild} does not have a logs channel.`)
        return;
    }

    if (oldMessage.author.bot || newMessage.author.bot) return;

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Edited')
                .addFields(
                    { name: 'Author', value: `<@${newMessage.member.user.id}>` },
                    { name: 'Channel', value: `<#${newMessage.channelId}>` },
                    { name: 'Before:', value: `"${oldMessage.content}"` },
                    { name: 'After:', value: `"${newMessage.content}"` }
                )
                .setFooter({ text: `Message edit` })
                .setTimestamp()
                .setColor('#FFBEEF')
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

                if (!channel) {
                    console.log(`${data.guild} does not have a logs channel.`)
                    return;
                }


                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Role Updated')
                            .addFields(
                                { name: 'Member', value: `<@${newMember.user.id}>` },
                                { name: 'Role removed:', value: `${role}` }
                            )
                            .setFooter({ text: `Role update` })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                });
            }
        });
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        newMember.roles.cache.forEach(role => {
            if (!oldMember.roles.cache.has(role.id)) {

                if (!channel) {
                    console.log(`${data.guild} does not have a logs channel.`)
                    return;
                }

                
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Role Updated')
                            .addFields(
                                { name: 'Member', value: `<@${newMember.user.id}>` },
                                { name: 'Role added:', value: `${role}` }
                            )
                            .setFooter({ text: `Role update` })
                            .setTimestamp()
                            .setColor('#FFBEEF')
                    ]
                });
            }
        })
    }
});