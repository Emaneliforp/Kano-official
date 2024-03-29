const { MessageActionRow, MessageSelectMenu } = require('discord.js');
module.exports = {
    data: {
        name: 'help',
        description: 'Show all available features or information of specified feature',
        help: 'Show all available features or information of specified feature',
        cooldown: { text: '`3s`', value: 3 },
        options: [
            {
                name: 'feature',
                description: 'name of the feature',
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'vouch',
                        value: 'vouch',
                    },
                    {
                        name: 'tp',
                        value: 'tp',
                    },
                    {
                        name: 'invite',
                        value: 'invite',
                    },
                    {
                        name: 'verify',
                        value: 'verify',
                    },
                ],
            },
        ],
    },
    async generateRow(client) {
        return new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help feature')
                    .setPlaceholder('select a feature')
                    .addOptions([
                        {
                            label: 'vouch',
                            description: client.commands.get('vouch').data.description,
                            value: 'vouch',
                        },
                        {
                            label: 'tp',
                            description: client.commands.get('tp').data.description,
                            value: 'tp',
                        },
                        {
                            label: 'invite',
                            description: client.commands.get('invite').data.description,
                            value: 'invite',
                        },
                        {
                            label: 'verify',
                            description: client.commands.get('verify').data.description,
                            value: 'verify',
                        },
                    ]),
            );
    },
    async generateFeatureHelp(command) {
        return {
            title: `${command.name} help`,
            description: command.help,
            fields:[
                {
                    name: 'Cooldown',
                    value: command.cooldown.text,
                },
            ],
        };
    },
	async execute(interaction, client) {
		const feature = interaction.options.getString('feature');
		let help;
        const row = await this.generateRow(client);
        if(feature != null) {
            return this.feature(interaction, client, row);
        }
        else {
            help = {
                title: 'Kano help',
                description: `Thank you for using Kano!
                    For more info, select the feature in the dropdown or visit our [gitbook](https://emaneliforp.gitbook.io/kano/)
                    Still need more help? Join our [Community Server](${client.guildInvite})`,
                fields:[
                    {
                        name: 'vouch',
                        value: `${(client.commands.get('vouch').data.emoji) ? `\`${client.commands.get('vouch').data.emoji}\` ` : ''}${client.commands.get('vouch').data.description}`,
                    },
                    {
                        name: 'tp',
                        value: `${(client.commands.get('tp').data.emoji) ? `\`${client.commands.get('tp').data.emoji}\` ` : ''}${client.commands.get('tp').data.description}`,
                    },
                    {
                        name: 'invite',
                        value: `${(client.commands.get('invite').data.emoji) ? `\`${client.commands.get('invite').data.emoji}\` ` : ''}${client.commands.get('invite').data.description}`,
                    },
                    {
                        name: 'verify',
                        value: `${(client.commands.get('verify').data.emoji) ? `\`${client.commands.get('verify').data.emoji}\` ` : ''}${client.commands.get('verify').data.description}`,
                    },
                ],
            };
        }
		return client.embed(interaction, help, false, row);
	},
    async select(interaction, client) {
        const command = client.commands.get(interaction.values[0]).data;
        const row = await this.generateRow(client);
        const help = await this.generateFeatureHelp(command);
        if(command.footer)
            help.footer = { text: command.footer };
        await interaction.update({ embeds: [help], components: [row] });
    },
    async feature(interaction, client, row) {
        const feature = interaction.options.getString('feature');
        const command = client.commands.get(feature).data;
        const help = await this.generateFeatureHelp(command);
        if(command.footer)
            help.footer = { text: command.footer };
        return client.embed(interaction, help, false, row);
    },
};