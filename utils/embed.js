module.exports = (interaction, content, ephemeral, row) => {
    if(!ephemeral) ephemeral = false;
    const reply = { embeds: [content], fetchReply: true, ephemeral: ephemeral };
    if(row) reply.components = [row];

    interaction.reply(reply)
        .catch((e) => {
            console.log(e);
            interaction.user.send({ content: `I might be missing permission to send embed in <#${interaction.channelId}>.\nIf this is caused by lag, please disregard.` })
                .catch(() => { return;});
        })
        .then(embed => {
            if(embed && content.react) {
                embed.react(content.react)
                    .catch((e) => {
                        console.log(e);
                        interaction.user.send({ content: `I might be missing permission to react to the embed in <#${interaction.channelId}>.\nPlease check if the bot has access and permission to use this emoji.` })
                            .catch(() => {return;});
                    });
            }
        });
};