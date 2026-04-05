const { EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require("fs");
const path = require("path");

const configGlobal = require("../config.json");
const serverId = configGlobal.guildId;

const config = require("../configuration/" + serverId + "/periodicReport.json");
const delay = config.reportInterval * 60 * 1000; // Replace with your Category ID

async function getRoleStatistics(config, client, serverId) {
  try {
    // Get role statistics
    const rolesIds = config.rolesIds;
    const roleStats = [];

    for (let roleId of rolesIds) {
      const guilde = client.guilds.cache.get(serverId);
      let role = guilde.roles.cache.get(roleId);

      roleStats.push({
        name: role.name,
        mention: role,
        count: role.members.size
      });
    }

    return {
      success: true,
      data: {
        serverId,
        roles: roleStats.sort((a, b) => a.count - b.count).reverse()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function getUserStatusStatistics(config, client, serverId) {
  try {
    const guild = client.guilds.cache.get(serverId);

    if (!guild) throw new Error("Guild not found");

    let onlineCount = 0;
    let afkCount = 0;
    let dndCount = 0;
    let offlineCount = 0;

    let memberList = await guild.members.fetch({ withPresences: true });

   memberList.forEach(member => {
      let presence = member.presence?.status || "offline";
      switch (presence) {
        case "online":
          onlineCount++;
          break;
        case "afk":
          afkCount++;
          break;
        case "dnd":
          dndCount++;
          break;
        case "offline":
          offlineCount++;
          break;
        default:
          offlineCount++;
          break;
      }
    });

    return {
      success: true,
      data: {
        serverId,
        statuses: {
          online: onlineCount,
          afk: afkCount,
          dnd: dndCount,
          offline: offlineCount
        },
        totalMembers: guild.members.cache.size
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendStatisticsEmbed(config, client, serverId) {
  //try {
    const channelId = config.periodicReportChannel;
    const guild = client.guilds.cache.get(serverId);
    const channel = guild.channels.cache.get(channelId);

    if (!channel) throw new Error("Channel not found");

    // Get both sets of statistics
    const roleStatsResult = await getRoleStatistics(config, client, serverId);
    const statusStatsResult = await getUserStatusStatistics(config, client, serverId);

    if (!roleStatsResult.success || !statusStatsResult.success) {
      throw new Error(roleStatsResult.error || statusStatsResult.error);
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle('📊 System Information')
      .setFooter({ 
        text: "System Monitor",
        iconURL: "https://slate.dan.onl/slate.png",
      })
      .setTimestamp();

    // Add role statistics section
    if (roleStatsResult.data.roles.length > 0) {
      let rolesText = "\n";
      const topRoles = roleStatsResult.data.roles.slice(0, 10); // Show top 10 roles

      topRoles.forEach(role => {
        rolesText += `- ${role.mention}: ${role.count} members\n`;
      });

      embed.addFields({ name: "Role Memberships", value: rolesText });
    }

    // Add status statistics section
    const statuses = statusStatsResult.data.statuses;
    let statusText = "\n";
    Object.entries(statuses).forEach(([status, count]) => {
      statusText += `- ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}\n`;
    });

    embed.addFields({ name: "User Statuses", value: statusText });

    let count = statusStatsResult.data.totalMembers + " utilisateurs";

    embed.addFields({ name: "Total Members", value: count });

    // Send the embed to the specified channel
    await channel.send({ embeds: [embed] });
    
    return {
      success: true,
      messageId: "Message sent successfully"
    };
  /*} catch (error) {
    return {
      success: false,
      error: error.message
    };
  }*/
}

module.exports = { getRoleStatistics, getUserStatusStatistics, sendStatisticsEmbed };