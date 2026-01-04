module.exports = {
  apps: [

    {
      name: "game-server",
      cwd: "./Game Server",
      script: "src/index.js"
    },

    {
      name: "admin-dashboard",
      cwd: "./Game Admin Dashboard/backend",
      script: "index.js"
    },

    {
      name: "discord-bot",
      cwd: "./Game-Discord-Bot",
      script: "index.js"
    }

  ]
};