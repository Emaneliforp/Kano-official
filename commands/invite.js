module.exports = {
	data:  {
		name: 'invite',
		description: 'Invite me to your server!',
        emoji: '🔖',
		help: '`🔖` Invite me to your server!',
		cooldown: { text: '`3s`', value: 3 },
	},
	async execute(interaction, client) {
		const content = {
            title: '`🔖` Invites',
            fields:[
                {
                    name: 'Bot invite⠀⠀⠀',
                    value: `[\`🤖\` Here](${client.botInvite})`,
                    inline: true,
                },
                {
                    name: 'Support server⠀⠀⠀',
                    value: `[\`🙌\` Here](${client.guildInvite})`,
                    inline: true,
                },
                {
                    name: 'Patreon',
                    value: `[\`💖\` Here](${client.patreon})`,
                    inline: true,
                },
            ],
        };
		return client.embed(interaction, content);
	},
};