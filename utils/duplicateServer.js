const { Client, GatewayIntentBits } = require('discord.js');

// Function to duplicate a server into JSON
function getServer(server) {
  return {
    name: server.name,
    ownerId: server.ownerId,
    channels: server.channels.cache.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      permissions: channel.permissions
    })),
    members: server.members, // Simplified - consider a proper member management system
    roles: server.roles.cache.map(role => ({
      id: role.id,
      name: role.name,
      color: role.color
    })),
    threads: server.threads.cache.map(thread => ({
      id: thread.id,
      parentId: thread.parentId,
      name: thread.name,
      permissions: thread.permissions
    })),
    forumCategories: server.forumCategories.cache.map(category => ({
      id: category.id,
      name: category.name
    }))
  };
}


// Function to create a server from JSON
function createServerFromJson(jsonData) {
  const server = {
    name: jsonData.name,
    ownerId: jsonData.ownerId,
    channels: [],
    members: [],
    roles: [],
    threads: [],
    forumCategories: []
  };

  // Populate channels
  jsonData.channels.forEach(channelData => {
    server.channels.push({
      id: channelData.id,
      name: channelData.name,
      type: channelData.type,
      permissions: channelData.permissions
    });
  });

  // Populate roles (similar to channels)
  jsonData.roles.forEach(roleData => {
    server.roles.push({
      id: roleData.id,
      name: roleData.name,
      color: roleData.color
    });
  });

  // Populate threads
  jsonData.threads.forEach(threadData => {
    server.threads.push({
      id: threadData.id,
      parentId: threadData.parentId,
      name: threadData.name,
      permissions: threadData.permissions
    });
  });

  // Populate forum categories
  jsonData.forumCategories.forEach(categoryData => {
    server.forumCategories.push({
      id: categoryData.id,
      name: categoryData.name
    });
  });


  return server;
}

module.exports = { createServerFromJson, getServer };