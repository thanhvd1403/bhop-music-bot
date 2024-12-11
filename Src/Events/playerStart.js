const { useMainPlayer } = require("discord-player");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const player = useMainPlayer();
let previousMessageId = null;

const createButton = (id, style, label) =>
  new ButtonBuilder().setCustomId(id).setStyle(style).setLabel(label);

const createEmbed = (clientUser, track, progressBar) => {
  const npEmbed = new EmbedBuilder()
    .setAuthor({ name: clientUser.tag, iconURL: clientUser.displayAvatarURL() })
    .setThumbnail(track.thumbnail)
    .setColor("#505050")
    .setTitle("Starting next song... Now Playing 🎵")
    .setDescription(
      `${track.title}${
        track.queryType !== "arbitrary" ? ` ([Link](${track.url}))` : ""
      }\n*Length: ${track.duration}*`
    )
    .setTimestamp();

  if (track.requestedBy) {
    const requesterTag =
      track.requestedBy.discriminator !== 0
        ? track.requestedBy.tag
        : track.requestedBy.username;
    npEmbed.setFooter({ text: `Requested by: ${requesterTag}` });
  }

  return npEmbed;
};

const createComponents = () => [
  new ActionRowBuilder().addComponents(
    createButton("np-back", 2, "⏮️"),
    createButton("np-pauseresume", 2, "⏯️"),
    createButton("np-skip", 2, "⏭️"),
    createButton("np-clear", 2, "🧹 Clear Queue")
  ),
  new ActionRowBuilder().addComponents(
    createButton("np-volumeadjust", 2, "🔊"),
    createButton("np-loop", 2, "🔂"),
    createButton("np-shuffle", 2, "🔀"),
    createButton("np-stop", 2, "🛑"),
    createButton("np-delete", 1, "🗑️")
  ),
];

module.exports = {
  name: "playerStart",
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on("playerStart", async (queue, track) => {
      const progressBar = queue.node
        .createProgressBar()
        .replace(/ 0:00/g, " ◉ LIVE");
      const clientUser = player.client.user;

      const npEmbed = createEmbed(clientUser, track, progressBar);
      const components = createComponents();
      const channel = queue.metadata.channel;

      if (
        !channel
          .permissionsFor(channel.guild.members.me)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        console.error(
          `No permissions to send messages in channel ID: ${channel.id}`
        );
        return;
      }

      // Delete the previous message if it exists
      if (previousMessageId) {
        try {
          const oldMessage = await channel.messages.fetch(previousMessageId);
          if (oldMessage) await oldMessage.delete();
        } catch (error) {
          console.error(`Failed to delete previous message: ${error.message}`);
        }
      }

      // Send new message and store its ID
      try {
        const msg = await channel.send({
          embeds: [npEmbed],
          components,
        });
        previousMessageId = msg.id;
      } catch (error) {
        console.error(`Failed to send new message: ${error.message}`);
      }
    });
  },
};
