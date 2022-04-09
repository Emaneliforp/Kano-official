module.exports = {
	data:  {
		name: 'cooldown',
		description: 'Cooldown and chill `📽️`',
		usage: 'unusable',
		aliases: 'cd',
		cooldown: { text: '`???`', value: 3 },
	},
	async execute(interaction, client, timeLeft) {
		const content = {
            title: '`📽️` Cooldown and Chill',
			description: `Please wait for \`${timeLeft}s\` before using this command again.`,
		};
		return client.embed(client, interaction, content);
	},
};