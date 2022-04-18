const { Permissions } = require('discord.js');

const trustScale = ['not trusted', 'not trusted', 'not trusted',
                'newbie', 'newbie', 'newbie',
                'trusted', 'trusted', 'trusted',
                'very trusted', 'very trusted',
                'pro', 'pro', 'pro', 'master'];

const vouchBadge = ['https://cdn.discordapp.com/emojis/820129175016964096.png?v=1', // not trusted
                    'https://cdn.discordapp.com/emojis/820129175591452725.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175653974087.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175645323294.png?v=1', // newbie
                    'https://cdn.discordapp.com/emojis/820129175645192243.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175708499968.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175322099714.png?v=1', // trusted
                    'https://cdn.discordapp.com/emojis/820129175649910824.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175892918292.png?v=1',
                    'https://cdn.discordapp.com/emojis/820129175804706876.png?v=1', // very trusted
                    'https://cdn.discordapp.com/emojis/820129175493935195.png?v=1',
                    'https://cdn.discordapp.com/emojis/820130388298694666.png?v=1',
                    'https://cdn.discordapp.com/emojis/820130388298694666.png?v=1',
                    'https://cdn.discordapp.com/emojis/820130388298694666.png?v=1',
                    'https://cdn.discordapp.com/emojis/820130388298694666.png?v=1'];

const vouchCooldown = new Map();

module.exports = {
	data:  {
		name: 'vouch',
		description: 'Check vouches to prevent scam and vouch people that you trust',
		emoji: '📮',
		help: `\`📮\` Check vouches to prevent scam and vouch people that you trust.
        *Vouch isn't the absolute scam prevention. Always check profile, inventory, and ask for middleman if needed.*\n
        \`vouch view <user>\`: get the user's vouch\n
        \`vouch bump [user]\`: vouch the user
        - **vouch channel must be setup.**
        - only vouch after you have successfully completed the trade and **avoid vouch for the same person multiple times**.
        __why my vouch didn't pass through?__
        \`🕒\` you can vouch the same person once every 10min
        \`⛔\` the person that you are trying to vouch is blacklisted from the vouch system\n
        __**Vouch Channel (required to setup)**__
        \`vouch channel set [channel]\`: setup channel for vouch
        \`vouch channel view\`: view channel for vouch
        \`vouch channel off\`: turn off channel for vouch\n
        __**Mod Role**__
        \`vouch modrole set [role]\`: give role permission to use mod commands (blacklist, unblacklist, remove)
        \`vouch modrole view\`: view vouch mod role
        \`vouch modrole off\`: remove vouch mod role\n
		__**Mod Commands**__
        \`vouch blacklist [user]\`: blacklist user from vouch locally
        \`vouch unblacklist [user]\`: unblacklist user from vouch locally
        \`vouch set [user] [#vouch]\`: set vouch for user
        \`vouch remove [user] [#vouch]\`: remove vouch from user\n
        __**Global Vouch**__
        \`vouch global add [serverID]\`: add global vouch server
        \`vouch global list\`: see all global vouch servers
        \`vouch global remove [serverID]\`: remove global vouch server`,
		cooldown: { text: '`3s`', value: 3 },
		footer: 'usage syntax: [required] <optional>',
		options: [
            {
                name: 'view',
                description: 'get the user\'s vouch',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user',
                        type: 6,
                        required: false,
                    },
                ],
            },
            {
                name: 'bump',
                description: 'vouch user',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user',
                        type: 6,
                        required: true,
                    },
                ],
            },
            {
                name: 'channel',
                description: 'setup vouch channel',
                type: 2,
                options: [
                    {
                        name: 'set',
                        description: 'set vouch channel',
                        type: 1,
                        options: [
                            {
                                name: 'channel',
                                description: 'vouch channel',
                                type: '7',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'view',
                        description: 'show vouch channel',
                        type: 1,
                    },
                    {
                        name: 'off',
                        description: 'turn off vouch channel',
                        type: 1,
                    },
                ],
            },
            {
                name: 'modrole',
                description: 'setup mod role (perm to use mod commands)',
                type: 2,
                options: [
                    {
                        name: 'set',
                        description: 'set mod role',
                        type: 1,
                        options: [
                            {
                                name: 'role',
                                description: 'vouch mod role',
                                type: '8',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'off',
                        description: 'turn of vouch mod role',
                        type: 1,
                        options: [
                            {
                                name: 'role',
                                description: 'vouch mod role',
                                type: '8',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'view',
                        description: 'view mod role',
                        type: 1,
                    },
                ],
            },
            {
                name: 'blacklist',
                description: 'blacklist user from vouch',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user to be blacklisted',
                        type: 6,
                        required: true,
                    },
                ],
            },
            {
                name: 'unblacklist',
                description: 'unblacklist user from vouch',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user',
                        type: 6,
                        required: true,
                    },
                ],
            },
            {
                name: 'set',
                description: 'set user\'s local vouch',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user',
                        type: 6,
                        required: true,
                    },
                    {
                        name: 'vouch',
                        description: 'number of local vouch',
                        type: 4,
                        required: true,
                    },
                ],
            },
            {
                name: 'remove',
                description: 'remove local vouch from a user',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user',
                        type: 6,
                        required: true,
                    },
                    {
                        name: 'vouch',
                        description: 'number of local vouch to be removed',
                        type: 4,
                        required: true,
                    },
                ],
            },
            {
                name: 'global',
                description: 'setup global vouch for the server',
                type: 2,
                options: [
                    {
                        name: 'add',
                        description: 'add server to global servers',
                        type: 1,
                        options: [
                            {
                                name: 'guildid',
                                description: 'server\'s id',
                                type: '3',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'remove',
                        description: 'remove server from global servers',
                        type: 1,
                        options: [
                            {
                                name: 'guildid',
                                description: 'server\'s id',
                                type: '3',
                                required: true,
                            },
                        ],
                    },
                    {
                        name: 'list',
                        description: 'view all global servers',
                        type: 1,
                    },
                ],
            },
		],
	},
	async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false);
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        if(subcommand == 'bump')
            return this.bump(interaction, client);
        if(subcommandGroup == 'channel')
            return this.channel(interaction, client);
        if(subcommandGroup == 'global')
            return this.global(interaction, client);
        if(subcommandGroup == 'modrole')
            return this.modrole(interaction, client);
        if(subcommand == 'view')
            return this.view(interaction, client);
        if(subcommand == 'blacklist')
            return this.blacklist(interaction, client);
        if(subcommand == 'unblacklist')
            return this.unblacklist(interaction, client);
        if(subcommand == 'set')
            return this.set(interaction, client);
        if(subcommand == 'remove')
            return this.remove(interaction, client);
	},
    async getVouch(client, interaction, userID) {
        if(!userID) return;
        const vouch = {
            global: 0,
            local: 0,
            bl: false,
            footer: trustScale[0],
            footerBadge: vouchBadge[0],
        };
        const record = await client.db.getData(client, client.VDB, 'vouch/' + userID);
        if(!record) return vouch;
        if(record['bl']) vouch['bl'] = true;
        if(record['localbl'])
            if(record['localbl'].includes(interaction.guildId)) vouch['bl'] = true;
        if(vouch['bl']) {
            vouch['footer'] = 'potential scammer',
            vouch['footerBadge'] = 'https://cdn.discordapp.com/emojis/821984601886425119.png?v=1';
        }
        else {
            if(record[interaction.guildId]) vouch['local'] = record[interaction.guildId];
            vouch['global'] = await this.getGlobal(client, interaction.guildId, record);
            let totalVouch = Math.floor((vouch['local'] + vouch['global']) / 10);
            if(totalVouch >= trustScale.length) totalVouch = trustScale.length - 1;
            vouch['footer'] = trustScale[totalVouch];
            vouch['footerBadge'] = vouchBadge[totalVouch];
        }
        return vouch;
    },
    async getGlobal(client, guildID, vouch) {
        const globalGuild = await client.db.getData(client, client.VDB, 'global/' + guildID);
        if(!globalGuild) return 0;
        let globalVouch = 0;
        for(const i in globalGuild) {
            if(vouch[i])
                globalVouch += vouch[i];
        }
        return globalVouch;
    },
    async view(interaction, client) {
        let user = interaction.options.getUser('user');
        if(!user) user = interaction.user;
        let vouch = await this.getVouch(client, interaction, user.id);
        if(!vouch) vouch = {};
        const content = {
            author: { name: `${user.username}'s vouches`, icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` },
            fields:[
                { name: 'global', value: `\`${vouch['global']}\``, inline: true },
                { name: 'local', value: `\`${vouch['local']}\``, inline: true },
            ],
            footer: { text: `trust rating: ${vouch['footer']}`, icon_url: vouch['footerBadge'] },
        };
        client.embed(interaction, content);
    },
    async bump(interaction, client) {
        if(!client.vouch.channel[interaction.guild.id]) {
            return client.embed(interaction, { description: 'This server didn\'t setup a vouch channel.' });
        }
        if(client.vouch.channel[interaction.guild.id] != interaction.channel) {
            return client.embed(interaction, { description:  `Please vouch in <#${client.vouch.channel[interaction.guild.id]}>.` });
        }
        const user = interaction.options.getUser('user');
        if(user.id == interaction.user.id)
            return interaction.user.send('Your recent vouch has been rejected. Please don\'t vouch yourself.')
                .catch(e => console.log(e));
        if(vouchCooldown.get(interaction.user.id) == user.id)
            return client.embed(interaction, { description: '`🕒` You already vouch for this user recently.' });
        let vouch = await this.getVouch(client, interaction, user.id);
        if(!vouch) vouch = {};
        if(vouch.bl)
            return client.embed(interaction, { description: '`⛔` Your vouch is rejected.' });
        await client.db.setData(client, client.VDB, 'vouch/' + user.id + '/' + interaction.guildId, vouch['local'] + 1);
        vouchCooldown.set(interaction.user.id, user.id);
        setTimeout(() => { vouchCooldown.delete(interaction.user.id); }, 600000);
        return client.embed(interaction, { description: `\`✅\` Thanks for vouching! <@!${user.id}> now has \`${vouch['local'] + 1}\` vouches.` });
    },
    async channel(interaction, client) {
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        const subcommand = interaction.options.getSubcommand(false);
        if(subcommand == 'view') {
            const channel = (client.vouch.channel[interaction.guildId]) ? `<#${client.vouch.channel[interaction.guildId]}>` : '`not set`';
            return client.embed(interaction, { description: `This server's vouch channel is ${channel}` });
        }
        if(subcommand == 'off') {
            await client.db.removeData(client, client.VDB, 'vouchChannels/' + interaction.guildId);
            await client.setup.getVouch(client);
            return client.embed(interaction, { description: 'Vouch channel has been turned off.' });
        }
        if(subcommand == 'set') {
            const channel = interaction.options.getChannel('channel');
            await client.db.setData(client, client.VDB, 'vouchChannels/' + interaction.guildId, channel.id);
            await client.setup.getVouch(client);
            return client.embed(interaction, { description: `Vouch channel has been set to <#${channel.id}>.` });
        }
    },
    async global(interaction, client) {
        const subcommand = interaction.options.getSubcommand(false);
        if(subcommand == 'list') {
            const global = await client.db.getData(client, client.VDB, 'global/' + interaction.guildId);
            let description = '';
            for(const i in global) {
                description += global[i] + '\n';
            }
            if(description == '') description = 'No global vouch guild has been setup.';
            return client.embed(interaction, { title: 'Global Vouch Guilds', description: `${description}` });
        }
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        let guild = await client.guilds.cache.get(interaction.options.getString('guildid'));
            if(!guild) guild = await client.kano2.guilds.cache.get(interaction.options.getString('guildid'));
            if(!guild)
                return client.embed(interaction, { description: 'Invalid guild id. `vouch global add/remove [guildID]`' });
        if(subcommand == 'add') {
            let global = await client.db.getData(client, client.VDB, 'global/' + interaction.guildId);
            if(!global) global = {};
            if(global[guild.id])
                return client.embed(interaction, { description: `${guild.name} is already a global vouch guild.` });
            if(Object.keys(global).length >= 20)
                return client.embed(interaction, { description: 'You already have maximum global vouch guilds (20) setup.' });
            global[guild.id] = guild.name;
            await client.db.setData(client, client.VDB, 'global/' + interaction.guildId, global);
            return client.embed(interaction, { description: `${guild.name} has been added as global vouch guild!` });
        }
        if(subcommand == 'remove') {
            const global = await client.db.getData(client, client.VDB, 'global/' + interaction.guildId);
            if(!global)
                return client.embed(interaction, { description: 'No global vouch guild has been setup.' });
            if(!global[guild.id])
                return client.embed(interaction, { description: `Guild ${guild.name} isn't a global vouch guild.` });
            delete global[guild.id];
            await client.db.setData(client, client.VDB, 'global/' + interaction.guildId, global);
            return client.embed(interaction, { description: `${guild.name} has been removed global vouch guild.` });
        }
    },
    async modrole(interaction, client) {
        const highPerm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id == '434568259837362181');
        if(!highPerm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD`.' });
        const subcommand = interaction.options.getSubcommand(false);
        if(subcommand == 'view') {
            const mod = (client.vouch.mod[interaction.guildId]) ? `<@&${client.vouch.mod[interaction.guildId]}>` : '`not set`';
            return client.embed(interaction, { description: `This server's vouch mod role is ${mod}` });
        }
        if(subcommand == 'off') {
            await client.db.removeData(client, client.VDB, 'vouchMods/' + interaction.guildId);
            client.setup.getVouch(client);
            return client.embed(interaction, { description: 'Vouch mod role has been turned off.' });
        }
        if(subcommand == 'set') {
            const role = interaction.options.getRole('role');
            await client.db.setData(client, client.VDB, 'vouchMods/' + interaction.guildId, role.id);
            await client.setup.getVouch(client);
            return client.embed(interaction, { description: `\`${role.name}\` has been set as the vouch's mod role.` });
        }
    },
    async blacklist(interaction, client) {
        const perm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.roles.cache.has(client.vouch.mod[interaction.guildId] + '') || interaction.user.id == '434568259837362181');
        if(!perm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD, VOUCH_MOD`.' });
        const user = interaction.options.getUser('user');
        let vouch = await client.db.getData(client, client.VDB, 'vouch/' + user.id);
        if(!vouch)
            vouch = { localbl:[] };
        else if(!vouch['localbl'])
            vouch['localbl'] = [];
        vouch['localbl'].push(interaction.guildId);
        await client.db.setData(client, client.VDB, 'vouch/' + user.id, vouch);
        client.embed(interaction, { description: `${user.username} has been locally blacklisted.
            Please report to [support server](${client.guildInvite}) for global blacklist.` });
    },
    async unblacklist(interaction, client) {
        const perm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.roles.cache.has(client.vouch.mod[interaction.guildId] + '') || interaction.user.id == '434568259837362181');
        if(!perm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD, VOUCH_MOD`.' });
        const user = interaction.options.getUser('user');
        const localbl = await client.db.getData(client, client.VDB, 'vouch/' + user.id + '/localbl');
        if(localbl)
            if(localbl.indexOf(interaction.guildId) != -1) {
                localbl.splice(localbl.indexOf(interaction.guildId), 1);
                client.db.setData(client, client.VDB, 'vouch/' + user.id + '/localbl', localbl);
                return client.embed(interaction, { description: `${user.username} has been locally unblacklisted.` });
            }
        return client.embed(interaction, { description: `${user.username} wasn't locally blacklisted.` });
    },
    async set(interaction, client) {
        const perm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.roles.cache.has(client.vouch.mod[interaction.guildId] + '') || interaction.user.id == '434568259837362181');
        if(!perm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD, VOUCH_MOD`.' });
        const user = interaction.options.getUser('user');
        console.log(user);
        const amount = interaction.options.getInteger('vouch');
        let vouch = await client.db.getData(client, client.VDB, 'vouch/' + user.id);
        if(!vouch) vouch = {};
        vouch[interaction.guildId] = amount;
        await client.db.setData(client, client.VDB, 'vouch/' + user.id, vouch);
        return client.embed(interaction, { description: `${user.username}'s vouch has been set to \`${amount}\`.` });
    },
    async remove(interaction, client) {
        const perm = (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.roles.cache.has(client.vouch.mod[interaction.guildId] + '') || interaction.user.id == '434568259837362181');
        if(!perm) return client.embed(interaction, { description: 'You are missing permission. **Permissions needed:** `MANAGE_GUILD, VOUCH_MOD`.' });
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('vouch');
        let vouch = await client.db.getData(client, client.VDB, 'vouch/' + user.id);
        if(!vouch) {
            vouch = {};
            vouch[interaction.guildId] = 0;
        }
        vouch[interaction.guildId] -= amount;
        await client.db.setData(client, client.VDB, 'vouch/' + user.id, vouch);
        return client.embed(interaction, { description:`${user.username}'s vouch is now \`${vouch[interaction.guildId]}\`.` });
    },
};