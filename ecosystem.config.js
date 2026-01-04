module.exports = {
  apps: [

    // 🧠 Game Server
    {
      name: "game-server",
      cwd: "./Game Server",
      script: "src/index.js",
      env: {
        NODE_ENV: "production"
      }
    },

    // 🛠 Admin Dashboard Backend
    {
      name: "admin-dashboard",
      cwd: "./Game Admin Dashboard/backend",
      script: "index.js",
      env: {
        NODE_ENV: "production"
      }
    },

    // 🌍 Game Website (لو فيه Backend)
    {
      name: "game-website",
      cwd: "./Game Website",
      script: "index.js",
      env: {
        NODE_ENV: "production"
      }
    },

    // 🤖 Discord Bot
    {
      name: "discord-bot",
      cwd: "./Game-Discord-Bot",
      script: "index.js",
      env: {
        NODE_ENV: "production"
      }
    }

  ]
};