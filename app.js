const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Options, Intents } = require('discord.js');
const { token, token1 } = require('./config.json');
const fs = require('fs');
const wait = require('node:util').promisify(setTimeout);

const client = new Client({
	makeCache: Options.cacheWithLimits({
		ApplicationCommandManager: 0, // guild.commands
		GuildBanManager: 0, // guild.bans
		GuildInviteManager: 0, // guild.invites
		GuildManager: Infinity, // client.guilds
		GuildMemberManager: 500, // guild.members
		GuildStickerManager: 0, // guild.stickers
		MessageManager: 0, // channel.messages
		PresenceManager: 0, // guild.presences
		ReactionManager: 0, // message.reactions
		ReactionUserManager: 0, // reaction.users
		StageInstanceManager: 0, // guild.stageInstances
		ThreadManager: 0, // channel.threads
		ThreadMemberManager: 0, // threadchannel.members
		UserManager: 0, // client.users
		VoiceStateManager: 0, // guild.voiceStates
	}),
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.commands = new Collection;
client.JSONCommands = [];
client.cooldowns = new Collection();

const client1 = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	if(file == 'cooldown.js') continue;
	client.JSONCommands.push(command.data);
}


const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationCommands('805218902572662884'), // change id
			// Routes.applicationGuildCommands('810041192020443147', '691518431681445949'),
			{ body: client.JSONCommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

client.setup = require('./utils/setup.js');

client.once('ready', async () => {
	console.log('Ready!');
	client.user.setActivity('/help', { type: 'PLAYING' });
	await client.setup.init(client);
	// await client.api.applications(client.user.id).guilds("814029116428124170").commands("878854470027595808").delete();
    // await client.api.applications(client.user.id).guilds('691518431681445949').commands.get()
    //     .catch()
    //     .then(commands => {
	// 		commands.forEach(command => console.log(command.name + ': ' + command.id));
	// 	});
});


client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			const { cooldowns } = client;
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const cooldownAmount = (command.data.cooldown.value || 3) * 1000;
			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
				if (now < expirationTime) {
					const timeLeft = ((expirationTime - now) / 1000);
					return client.commands.get('cooldown').execute(interaction, client, timeLeft);
				}
			}
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
			await command.execute(interaction, client);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	if(interaction.isSelectMenu()) {
		const command = client.commands.get(interaction.customId.split(' ')[0]);
		if (!command) return;
		try {
			await command.select(interaction, client);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	if (interaction.isButton()) {
		if(interaction.customId == 'verify') {
			await wait(2000);
			return client.commands.get('verify').verify(interaction, client);
		}
	}
});

client.login(token).catch(console.log);
client1.login(token1).catch(console.log);

client.kano2 = client1;
