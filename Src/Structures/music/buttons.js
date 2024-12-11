const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function createQueueButtons() {
  const prevButton = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("Previous")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⬅️");
  const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("➡️");

  return new ActionRowBuilder().addComponents(prevButton, nextButton);
}

function createPlayingButtons() {
  const actionbutton = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("np-back").setStyle(2).setLabel("⏮️"),
    new ButtonBuilder()
      .setCustomId("np-pauseresume")
      .setStyle(2)
      .setLabel("⏯️"),
    new ButtonBuilder().setCustomId("np-skip").setStyle(2).setLabel("⏭️"),
    new ButtonBuilder()
      .setCustomId("np-clear")
      .setStyle(2)
      .setLabel("🧹 Clear Queue")
  );

  const actionbutton2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("np-volumeadjust")
      .setStyle(2)
      .setLabel("🔊"),
    new ButtonBuilder().setCustomId("np-loop").setStyle(2).setLabel("🔂"),
    new ButtonBuilder().setCustomId("np-shuffle").setStyle(2).setLabel("🔀"),
    new ButtonBuilder().setCustomId("np-stop").setStyle(2).setLabel("🛑"),
    new ButtonBuilder().setCustomId("np-delete").setStyle(1).setLabel("🗑️")
  );

  return [actionbutton, actionbutton2];
}

module.exports = { createQueueButtons, createPlayingButtons };
