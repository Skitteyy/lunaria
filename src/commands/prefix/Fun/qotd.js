const { Message, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'qotd',
        description: 'sends a qotd question (only works in Skittey\'s server).',
        aliases: []
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        let channel = message.guild.channels.cache.find(channel => channel.id === '1143924916559806514')

        if (message.channel.id === '1143924916559806514') {
            message.delete()

            let questions = [
                "What's one thing you're grateful for today?",
                "If you could travel anywhere in the world right now, where would you go?",
                "What's a book that has had a significant impact on your life?",
                "What's your favorite way to spend a rainy day?",
                "If you could have a conversation with anyone, living or dead, who would it be?",
                "What's a skill you've always wanted to learn?",
                "What's the most adventurous thing you've ever done?",
                "What's the best piece of advice you've ever received?",
                "What's a small act of kindness you've recently witnessed?",
                "If you could have dinner with any historical figure, who would it be?",
                "What's a place you've never been to but would love to visit?",
                "What's your favorite quote and why?",
                "What's your go-to comfort food?",
                "What's a hobby you enjoy that not many people know about?",
                "If you could only listen to one song for the rest of your life, what would it be?",
                "What's a personal goal you're currently working towards?",
                "What's the most interesting documentary you've watched?",
                "If you could time travel, would you go to the past or the future?",
                "What's a movie that never gets old no matter how many times you watch it?",
                "What's a place that always brings back fond memories for you?",
                "What's a random act of kindness you've done recently?",
                "If you could have any superpower, what would it be and why?",
                "What's a skill you're proud to have mastered?",
                "What's the best part about your favorite season?",
                "What's a technology you couldn't live without?",
                "What's a moment that made you laugh really hard?",
                "What's your favorite way to unwind after a long day?",
                "What's a place in your hometown you'd recommend to visitors?",
                "If you could solve any global issue, what would it be?",
                "What's a historical event you wish you could have witnessed?",
                "What's a cuisine you've never tried but would like to?",
                "What's a song lyric that resonates with you deeply?",
                "If you could switch lives with someone for a day, who would it be?",
                "What's a childhood memory that always makes you smile?",
                "What's the most beautiful natural landscape you've seen?",
                "What's a documentary or book that changed your perspective on something?",
                "What's your favorite way to exercise or stay active?",
                "If you could donate a million dollars to any cause, which would you choose?",
                "What's a topic you could talk about for hours without getting bored?",
                "What's a goal you had as a child that you've since achieved?",
                "What's a place you'd love to see in person before you die?",
                "If you could live in any era of history, which would you choose?",
                "What's a talent or skill you wish you had?",
                "What's a famous person you admire and why?",
                "What's the best piece of advice you'd give to your younger self?",
                "What's a movie that never fails to make you emotional?",
                "What's a cuisine from another country that you enjoy?",
                "If you could spend a day with a fictional character, who would it be?",
                "What's a place you've visited that exceeded your expectations?",
                "What's the most daring thing you've ever done?",
                "If you could instantly master any instrument, which one would you choose?",
                "What's a movie you initially didn't like but grew to love?",
                "If you could invite three people to a dinner party, who would they be?",
                "What's a habit you've been trying to build or break?",
                "If you could travel back in time to give your younger self advice, what would you say?",
                "What's a quote that always motivates you?",
                "If you could bring one fictional character to life, who would it be?",
                "What's a destination you've visited that felt like a hidden gem?",
                "If you could witness any historical event, which would you choose?",
                "What's your favorite way to express your creativity?",
                "If you had to eat one cuisine for the rest of your life, what would it be?",
                "What's a skill you'd love to teach others?",
                "If you could be fluent in any language, which would you choose?",
                "What's a place you've always wanted to visit but haven't had the chance?",
                "If you could eliminate one modern annoyance, what would it be?",
                "What's a song that never fails to put you in a good mood?",
                "If you could be a character in a book, who would you be?",
                "What's a documentary that left you feeling inspired?",
                "If you could have any job for a day, what would it be?",
                "What's a piece of advice you've received that changed your life?",
                "If you could live in a fictional world, where would you choose?",
                "What's a place you'd love to see from a bird's-eye view?",
                "If you could instantly learn any dance style, which one would you pick?",
                "What's a technology that you're excited to see developed in the future?",
                "If you could be part of any historical civilization, which would you choose?",
                "What's a dish you've tried while traveling that you can't forget?",
                "If you could have dinner with a famous scientist, who would it be?",
                "What's a place that always makes you feel calm and centered?",
                "If you could witness any natural phenomenon, what would it be?",
                "What's a hobby you've been meaning to start but haven't?",
                "If you could learn the truth about one unsolved mystery, which one would it be?",
                "What's a famous landmark you'd love to explore up close?",
                "If you could invent a new holiday, what would it celebrate?",
                "What's a movie you think everyone should watch at least once?",
                "If you could switch lives with someone for a week, who would you choose?",
                "What's a dish from your culture that you're proud of?",
                "If you could have a conversation with an animal, which one would it be?",
                "What's a historical figure you'd love to have as a mentor?",
                "If you could spend a year traveling, where would you go first?",
                "What's a scientific mystery you're curious to see solved?",
                "If you could be part of any music band, past or present, which one would you join?",
                "What's a place you'd recommend for stargazing?",
                "If you could visit any time period without altering history, when would it be?",
                "What's a dream you've had that you vividly remember?",
                "If you could master any form of visual art, what would it be?",
                "What's a cultural festival you'd love to experience?",
                "If you could have any animal as a loyal companion, which would you choose?",
                "What's a futuristic technology you're skeptical about?",
                "If you could learn the answer to any unsolved crime, which would you pick?",
                "What's a place you've seen in movies that you'd like to visit in real life?"
            ]
    
            let question = questions[Math.floor(Math.random() * questions.length)];
    
            const embed = new EmbedBuilder()
                .setTitle(`Today's Question`)
                .setDescription(question)
                .setFooter({ text: 'Question of the day' })
                .setTimestamp()
    
            channel.send({
                embeds: [embed]
            });
        } else {
            return;
        }
    }
};
