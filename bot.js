(async () => {
  const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
  } = require("discord.js");
  const youtubeAuth = "replaced-by-getOauthTokens";
  const {
    YoutubeiExtractor,
    getOauthTokens,
  } = require("discord-player-youtubei");
  const { QuickDB } = require("quick.db");
  const { Player } = require("discord-player");
  const credentialManager = require("./Config");
  const dirPath = __dirname;
  const {
    messageCommandsManager,
    eventsManager,
    buttonManager,
    selectMenuManager,
    modalFormsManager,
    slashCommandsManager,
  } = require("./Src/Structures/Managers/Export");

  const botClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent, // Only for bots with message content intent access.
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Channel],
  });

  const player = new Player(botClient);
  const oauthTokens = getOauthTokens;
  console.log("Oauth Tokens: ", oauthTokens);
  await player.extractors.register(YoutubeiExtractor, {
    authentication: undefined,
  });

  await player.extractors.loadDefault(
    (ext) => !["YouTubeExtractor"].includes(ext)
  );

  exports.rootPath = dirPath;
  exports.client = botClient;
  exports.guildCooldownDB = new QuickDB({
    filePath: `${dirPath}/guildCooldownDB.sqlite`,
  });
  exports.globalCooldownDB = new QuickDB({
    filePath: `${dirPath}/globalCooldownDB.sqlite`,
  });
  exports.channelCooldownDB = new QuickDB({
    filePath: `${dirPath}/channelCooldownDB.sqlite`,
  });

  botClient.messageCommands = new Collection();
  botClient.messageCommandsAliases = new Collection();
  botClient.events = new Collection();
  botClient.buttonCommands = new Collection();
  botClient.selectMenus = new Collection();
  botClient.modalForms = new Collection();
  botClient.slashCommands = new Collection();

  await messageCommandsManager(botClient, dirPath);
  await eventsManager(botClient, dirPath);
  await buttonManager(botClient, dirPath);
  await selectMenuManager(botClient, dirPath);
  await modalFormsManager(botClient, dirPath);
  await botClient.login(credentialManager.botToken);
  await slashCommandsManager(botClient, dirPath);
})();
