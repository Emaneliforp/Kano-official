module.exports = class Fetch {
    static async getUser(client, input) {
        const user = { id:input };
        if(/<@!(\d)+>/.test(input)) {
            user['id'] = input.match(/<@!(\d)+>/)[0].slice(3, -1);
        }
        else if(/<@(\d)+>/.test(input)) {
            user['id'] = input.match(/<@(\d)+>/)[0].slice(2, -1);
        }
        const fetch = await client.users.fetch(user['id']).catch(console.error);
        if(fetch) {
            user['name'] = fetch.username;
            user['avatar'] = fetch.displayAvatarURL();
            return user;
        }
        return null;
    }
    static async getRole(guild, input) {
        const role = { id:input };
        if(/<@&(\d)+>/.test(input)) {
            role['id'] = input.match(/<@&(\d)+>/)[0].slice(3, -1);
        }
        const fetch = await guild.roles.fetch(role['id']).catch(console.error);
        if(fetch.name) {
            role['name'] = fetch.name;
            return role;
        }
        return null;
    }
    static async getChannel(client, input) {
        const channel = { id: input };
        if(/<#(\d)+>/.test(input)) {
            channel['id'] = input.match(/<#(\d)+>/)[0].slice(2, -1);
        }
        const fetch = await client.channels.fetch(channel['id']).catch(console.error);
        if(fetch) {
            channel.name = fetch.name;
            return channel;
        }
        return null;
    }
    static async getEmoji(guild, input) {
        const emoji = { id:input };
        if(input.split(':'))
            if(input.split(':')[2]) {
                emoji['id'] = input.split(':')[2];
                emoji['id'] = emoji['id'].split('>')[0];
            }
        const fetch = await guild.emojis.fetch(emoji.id).catch(console.error);
        if(fetch) {
            emoji.name = fetch.name;
            return emoji;
        }
        return null;
    }
};