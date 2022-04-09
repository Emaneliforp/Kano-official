module.exports = class Utils {
    static error(client, type, info, err) {
        client.DB.ref('error/' + type).push({ info: info, error: err })
            .catch(console.error);
    }
    static sendMessage(interaction, content, ephemeral) {
        if(!ephemeral) ephemeral = false;
        interaction.reply({ content: content, ephemeral: ephemeral })
            .catch(() => {
                interaction.user.send({ content: `I might be missing permission to send message in <#${interaction.channelId}>.\nIf this is caused by lag, please disregard.` })
                    .catch(() => { return;});
            });
    }
    static getRandomColor() {
        const colorPalette = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e91e63', '#f1c40f', '#e67e22', '#e74c3c', '#ffffff', '#23272a'];
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }

    static addRemoveMessageChannel(client, channel, duration, whiteListRole) {
        client.auction.removeMessageChannel[channel] = {
            duration: duration,
            whiteListRole: whiteListRole,
        };
    }

    static removeRemoveMessageChannel(client, channel) {
        delete client.auction.removeMessageChannel[channel];
    }
};