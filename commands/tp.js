const { Permissions } = require('discord.js');

module.exports = {
	data:  {
		name: 'tp',
		description: 'Teleport between channels and servers',
        emoji: '🌌',
        help: `\`🌌\` Teleport between channels and servers. [Recommened for Mobile]\n
            __**Commands**__
            \`tp goto [id]\`: tp to a channel
            \`tp list\`: show all tp
            \`tp add [id] [channel]\`: add a tp
            \`tp remove [id]\`: remove a tp
            \`tp reset\`: remove all tp\n
            __**Guild Settings**__
            \`tp perm list\`: view all roles with tp perm
            \`tp perm add [role]\`: restrict tp usage to a certain roles
            \`tp perm remove [role]\`: remove tp perm from a role
            \`tp perm off\`: remove tp usage restriction (enable tp for everyone)`,
		cooldown: { text: '`3s`', value: 3 },
		footer: 'usage syntax: [required]',
        options: [
            {
                name: 'goto',
                description: 'tp to a channel',
                type: 1,
                options: [
                    {
                        name: 'id',
                        description: 'id of the channel',
                        type: 3,
                        required: true,
                    },
                ],
            },
            {
                name: 'list',
                description: 'show all tp',
                type: 1,
            },
            {
                name: 'add',
                description: 'save new tp',
                type: 1,
                options: [
                    {
                        name: 'id',
                        description: 'id of the tp',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'channel',
                        description: 'channel to tp',
                        type: 3,
                        required: true,
                    },
                ],
            },
            {
                name: 'remove',
                description: 'remove a tp',
                type: 1,
                options: [
                    {
                        name: 'id',
                        description: 'id of the tp',
                        type: 3,
                        required: true,
                    },
                ],
            },
            {
                name: 'reset',
                description: 'remove all tp',
                type: 1,
            },
            {
                name: 'perm',
                description: 'restrict usage permission to a certain role',
                type: 2,
                options: [
                    {
                        name: 'add',
                        description: 'restrict tp usage to a certain roles',
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
                        description: 'remove tp usage perm from a role',
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
                        description: 'view roles with permission to use tp',
                        type: 1,
                    },
                    {
                        name: 'off',
                        description: 'remove tp usage restriction (enable tp for everyone)',
                        type: 1,
                    },
                ],
            },
        ],
	},
	async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false);
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        if(subcommandGroup == 'perm')
            return this.perm(interaction, client);
        if(subcommand == 'goto')
            return this.goto(interaction, client);
        if(subcommand == 'list')
            return this.list(interaction, client);
        if(subcommand == 'add')
            return this.add(interaction, client);
        if(subcommand == 'remove')
            return this.remove(interaction, client);
        if(subcommand == 'reset')
            return this.reset(interaction, client);
	},
    async goto(interaction, client) {
        if(client.tp.perm[interaction.guildId]) {
            const perm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.roles.cache.has(client.vouch.mod[interaction.guildId]) || interaction.user.id == '434568259837362181');
            if(!perm) return client.embed(interaction, { description: 'TP usage in this server is restricted.' });
        }
        const id = interaction.options.getString('id');
        const tp = await client.db.getData(client, client.DB, 'tp/user/' + interaction.user.id);
        for(const i in tp) {
            if(i.match(id.toLowerCase())) {
                return client.utils.sendMessage(interaction, `\`🌌\` <#${tp[i]}>`, true);
            }
        }
        return client.utils.sendMessage(interaction, '`⛔` TP not found!?', true);
    },
    async list(interaction, client) {
        const tp = await client.db.getData(client, client.DB, 'tp/user/' + interaction.user.id);
        let list = '';
        let e = false;
        for(const i in tp) {
            e = true;
            list += `**${i}:**<#${tp[i]}>\n`;
        }
        if(!e) list = 'no tp has been setup';
        const content = {
            author: { name:`${interaction.user.username}'s TP` },
            description: list,
        };
        return client.embed(interaction, content);
    },
    async reset(interaction, client) {
        const tp = await client.db.getData(client, client.DB, 'tp/user/' + interaction.user.id);
        await client.db.removeData(client, client.DB, 'tp/user/' + interaction.user.id);
        const content = {
            title: 'All TP Has Been Removed',
            description: `\`${Object.keys(tp).length}\` tp have been removed.`,
        };
        return client.embed(interaction, content);
    },
    async add(interaction, client) {
        const id = interaction.options.getString('id');
        let channelID = interaction.options.getString('channel');
        if(/<#(\d)+>/.test(channelID))
                channelID = channelID.match(/<#(\d)+>/)[0].slice(2, -1);
        if(channelID.length < 17 || (/[a-zA-Z]/g.test(channelID)) || channelID.includes('@'))
            return client.embed(interaction, { description: 'Invalid channel id. `tp add [id] [channel]`' });
        let tp = await client.db.getData(client, client.DB, 'tp/user/' + interaction.user.id);
        if(tp) {
            if(tp[id])
                return client.embed(interaction, { description: 'There is already tp with the same id.' });
            if(!client.premium.user.includes(interaction.user.id))
                if(Object.keys(tp).length >= 15)
                    return client.embed(interaction, { description: 'You already have maximum tp (15) saved.' });
            if(Object.keys(tp).length >= 30)
                return client.embed(interaction, { description: 'You already have maximum tp (30) saved.' });
        }
        else
            tp = {};
        tp[id] = channelID;
        await client.db.setData(client, client.DB, 'tp/user/' + interaction.user.id, tp);
        return client.embed(interaction, { description: `**${id}**:<#${channelID}> has been saved!` });
    },
    async remove(interaction, client) {
        const id = interaction.options.getString('id');
        const tp = await client.db.getData(client, client.DB, 'tp/user/' + interaction.user.id);
        if(!tp)
            return client.utils.sendMessage(interaction, 'You don\'t have any tp saved.');
        if(!tp[id])
            return client.utils.sendMessage(interaction, 'This tp isn\'t saved.');
        const channelID = tp[id];
        delete tp[id];
        await client.db.setData(client, client.DB, 'tp/user/' + interaction.user.id, tp);
        return client.embed(interaction, { description: `\`${id}\`: <#${channelID}> has been removed!` });
    },
    async perm(interaction, client) {
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        const subcommand = interaction.options.getSubcommand(false);
        if(subcommand == 'add') {
            const roleID = interaction.options.getRole('role').id;
            let perm = await client.db.getData(client, client.DB, 'tp/perm/' + interaction.guildId);
            if(!perm) perm = [];
            if(perm.includes(roleID))
                return client.embed(interaction, { description: `<@&${roleID}> already has permission to use tp.` });
            if(perm.length >= 10)
                return client.embed(interaction, { description: 'You already have max restricted role (10). Consider enable for all by running `/tp perm off`' });
            perm.push(roleID);
            await client.db.setData(client, client.DB, 'tp/perm/' + interaction.guildId, perm);
            client.setup.getTp(client);
            return client.embed(interaction, { description: `<@&${roleID}> has been given permission to use tp!` });
        }
        if(subcommand == 'remove') {
            const roleID = interaction.options.getRole('role').id;
            const perm = await client.db.getData(client, client.DB, 'tp/perm/' + interaction.guildId);
            if(!perm)
                return client.embed(interaction, { description: 'No restricted role has been setup' });
            if(!perm.includes(roleID))
                return client.embed(interaction, { description: `<@&${roleID}> doesn't have permission to use tp.` });
            for(let i = 0; i < perm.length; i++)
                if(perm[i] == roleID) perm.splice(i, 1);
            await client.db.setData(client, client.DB, 'tp/perm/' + interaction.guildId, perm);
            client.setup.getTp(client);
            return client.embed(interaction, { description: `<@&${roleID}> permission to use tp has been removed` });
        }
        if(subcommand == 'off') {
            await client.db.removeData(client, client.DB, 'tp/perm/' + interaction.guildId);
            client.setup.getTp(client);
            return client.embed(interaction, { description: 'Remove tp usage restriction (enable tp for everyone)' });
        }
        if(subcommand == 'list') {
            const perm = await client.db.getData(client, client.DB, 'tp/perm/' + interaction.guildId);
            let list = '';
            let e = false;
            for(const i in perm) {
                e = true;
                list += `<@&${perm[i]}>\n`;
            }
            if(!e) list = 'no role has been setup (everyone can use tp)';
            const content = {
                author: { name: 'TP Permission Restriction' },
                description: `${(e) ? 'Following roles have perm to use tp:\n\n' : ''}` + list,
            };
            return client.embed(interaction, content);
        }
    },
};
