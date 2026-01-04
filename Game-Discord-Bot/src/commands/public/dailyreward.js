const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const DAILY_COINS = 200;        // قيمة المكافأة
const COOLDOWN_HOURS = 24;      // مدة الانتظار

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dailyreward")
    .setDescription("Claim your daily reward"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const discordId = interaction.user.id;
    const user = await User.findOne({ discordId });

    if (!user) {
      return interaction.editReply(
        "❌ You must link your game account first."
      );
    }

    const now = new Date();
    const last = user.lastDailyAt ? new Date(user.lastDailyAt) : null;

    if (last) {
      const diffHours = (now - last) / (1000 * 60 * 60);
      if (diffHours < COOLDOWN_HOURS) {
        const nextTime = new Date(
          last.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000
        );
        return interaction.editReply(
          `⏳ You already claimed your daily reward.\n` +
          `Try again <t:${Math.floor(nextTime.getTime() / 1000)}:R>`
        );
      }
    }

    // منح المكافأة
    user.coins = (user.coins || 0) + DAILY_COINS;
    user.lastDailyAt = now;
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎁 Daily Reward Claimed!")
      .setColor(0x4CAF50)
      .setDescription(
        `You received **${DAILY_COINS} Coins** 🎉`
      )
      .addFields(
        { name: "New Balance", value: `${user.coins} Coins`, inline: true }
      )
      .setFooter({ text: "Come back tomorrow for more!" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};