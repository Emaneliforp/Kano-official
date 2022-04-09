const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data:  {
		name: 'verify',
		description: 'verify users',
        emoji: '✨',
        help: `\`✨\` Verify users\n
            __**Commands**__
            \`verify me\`: get/remove verified role\n
            __**Guild Settings**__
            \`verify role list\`: view all verified role
            \`verify role add [role]\`: add a verified role
            \`verify role remove [role]\`: remove a verified role
            \`verify role reset\`: remove all verified role
            
            \`verify message [title] [message]\`: add message to the verification
            \`verify post [channel]\`: post verify embed and button

            \`verify reset\`: reset verified message and role`,
		cooldown: { text: '`3s`', value: 3 },
		footer: 'usage syntax: [required]<optional>',
        options: [
            {
                name: 'me',
                description: 'get/remove verified role',
                type: 1,
            },
            {
                name: 'post',
                description: 'post verify embed and button',
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'channel to post',
                        type: 7,
                        required: true,
                    },
                ],
            },
            {
                name: 'message',
                description: 'add message to the verification',
                type: 1,
                options: [
                    {
                        name: 'title',
                        description: 'title of the verification',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'message',
                        description: 'message of the verification',
                        type: 3,
                        required: true,
                    },
                ],
            },
            {
                name: 'reset',
                description: 'reset verified message and role',
                type: 1,
            },
            {
                name: 'role',
                description: 'set verified role',
                type: 2,
                options: [
                    {
                        name: 'add',
                        description: 'add verified role',
                        type: 1,
                        options: [
                            {
                                name: 'role',
                                description: 'role to be added',
                                type: '8',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'remove',
                        description: 'remove verified role',
                        type: 1,
                        options: [
                            {
                                name: 'role',
                                description: 'role to be removed',
                                type: '8',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'list',
                        description: 'show all verified roles',
                        type: 1,
                    },
                    {
                        name: 'reset',
                        description: 'remove all verified role',
                        type: 1,
                    },
                ],
            },
        ],
	},
	async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false);
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        if(subcommand == 'me')
            return this.verify(interaction, client);
        if(subcommand == 'post')
            return this.post(interaction, client);
        if(subcommand == 'message')
            return this.message(interaction, client);
        if(subcommandGroup == 'role')
            return this.role(interaction, client);
        if(subcommand == 'reset')
            return this.reset(interaction, client);
	},
    async verify(interaction, client) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const roles = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
        if(!roles) return client.embed(interaction, { description: 'Verify hasn\'t been setup.' });
        let content = '';
        for(let i = 0; i < roles.length; i++) {
            content += `<@&${roles[i]}>\n`;
            member.roles.add(roles[i])
                .catch(()=>{
                    return interaction.user.send({ content: '`⛔` Bot is missing permissison to manage role. Please report to server\'s the moderators.' })
                    .catch(() => { return;});
                });
        }
        return client.embed(interaction, { title: `Welcome to ${interaction.guild.name}`, description: `You are successfully verified! The following roles were given to you:\n ${content}` }, true);
    },
    async message(interaction, client) {
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');
        client.db.setData(client, client.DB, 'verify/guild/' + interaction.guildId + '/message', { title: title, message: message });
        return client.embed(interaction, { description: 'Verified message has been set!' });
    },
    async role(interaction, client) {
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        const subcommand = interaction.options.getSubcommand(false);
        if(subcommand == 'add') {
            const roleID = interaction.options.getRole('role').id;
            let roles = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
            if(!roles) roles = [];
            if(roles.includes(roleID))
                return client.embed(interaction, { description: `<@&${roleID}> is already a verified role.` });
            if(roles.length >= 5)
                return client.embed(interaction, { description: 'You already have max verified role (5). Consider making a selfrole.' });
            roles.push(roleID);
            await client.db.setData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role', roles);
            return client.embed(interaction, { description: `<@&${roleID}> has been added to verified role!` });
        }
        if(subcommand == 'remove') {
            const roleID = interaction.options.getRole('role').id;
            const roles = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
            if(!roles)
                return client.embed(interaction, { description: 'No verified role has been setup.' });
            if(!roles.includes(roleID))
                return client.embed(interaction, { description: `<@&${roleID}> isn't a verified role.` });
            for(let i = 0; i < roles.length; i++)
                if(roles[i] == roleID) roles.splice(i, 1);
            await client.db.setData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role', roles);
            return client.embed(interaction, { description: `<@&${roleID}> has been removed from verified role.` });
        }
        if(subcommand == 'reset') {
            await client.db.removeData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
            return client.embed(interaction, { description: 'All verified role has been removed.' });
        }
        if(subcommand == 'list') {
            const roles = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
            let list = '';
            let e = false;
            for(const i in roles) {
                e = true;
                list += `<@&${roles[i]}>\n`;
            }
            if(!e) list = 'no verified role has been setup.';
            const content = {
                author: { name: 'Verified Role' },
                description: `${(e) ? 'Following roles will be given to the user:\n\n' : ''}` + list,
            };
            return client.embed(interaction, content);
        }
    },
    async post(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const message = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/message');
        if(!message) return client.embed(interaction, { description: 'Verify message hasn\'t been setup. Make sure verify role and message are setup.' });
        const roles = await client.db.getData(client, client.DB, 'verify/guild/' + interaction.guildId + '/role');
        if(!roles) return client.embed(interaction, { description: 'Verified role hasn\'t been setup.' });
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('verify')
                .setLabel('Verify me!')
                .setStyle('SUCCESS'),
            );
        const content = {
            title: message.title,
            description: message.message,
        };
        channel.send({ embeds: [content], ephemeral: false, components: [row] });
        return client.embed(interaction, { description: 'Verify has been posted!' });
    },
    async reset(interaction, client) {
        await client.db.removeData(client, client.DB, 'verify/guild/' + interaction.guildId);
        return client.embed(interaction, { description: 'Verify has been reset.' });
    },
};
