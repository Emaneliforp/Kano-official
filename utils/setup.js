const { botInvite, guildInvite, patreon, botMod, ModPremium, ModVouch } = require('../config.json');
module.exports = class Setup {
    static async init(client) {
        client.DB = require('../firebase').DB;
        client.VDB = require('../firebase').VDB;
        client.db = require('./db');
        client.utils = require('./utils');
        client.fetch = require('./fetch');
        client.embed = require('./embed');
        client.botInvite = botInvite;
        client.guildInvite = guildInvite;
        client.patreon = patreon;

        client.bot = {
            mod: botMod,
            premium: ModPremium,
            vouch: ModVouch,
        };

        client.prefix = {};
        client.premium = { user: [], guild: [] };
        client.vouch = { channel: {}, mod: {} };
        client.auction = { mod: {}, removeMessageChannel: {} };
        client.ar = { mod: {} };
        client.tp = { perm: {} };
        client.snipe = { perm: {} };

        await client.setup.getPremium(client);
        await client.setup.getPrefix(client);
        await client.setup.getVouch(client);
        await client.setup.getTp(client);
        return client;
    }
    static async getPrefix(client) {
        client.prefix = await client.db.getData(client, client.DB, 'prefix/');
    }
    static async getPremium(client) {
        const premium = await client.db.getData(client, client.DB, 'premium/');
        for(const i in premium) {
            client.premium.user.push(i);
            if(premium[i]['guild'])
                for(const j in premium[i]['guild'])
                    client.premium.guild.push(j);
        }
        console.log(`found ${client.premium.guild.length} premium servers`);
    }
    static async getVouch(client) {
        client.vouch.channel = await client.db.getData(client, client.VDB, 'vouchChannels');
        if(!client.vouch.channel) client.vouch.channel = {};
        client.vouch.mod = await client.db.getData(client, client.VDB, 'vouchMods');
        if(!client.vouch.mod) client.vouch.mod = {};
    }
    static async getTp(client) {
        client.tp.perm = await client.db.getData(client, client.DB, 'tpPerm/');
    }
};