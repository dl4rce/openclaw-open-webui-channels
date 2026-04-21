# OpenClaw Open WebUI Channels Plugin

[🇯🇵 日本語版はこちら](README.ja.md)

A plugin that connects OpenClaw to Open WebUI Channels. Enables OpenClaw to act as a user within Open WebUI and engage in bidirectional communication in channels.

> **This is the AI·Collab fork** ([dl4rce/openclaw-open-webui-channels](https://github.com/dl4rce/openclaw-open-webui-channels)) of the original plugin by [Skyzi000](https://github.com/skyzi000/openclaw-open-webui-channels).
> It adds **token-based authentication** so the plugin works with AI·Collab's SSO architecture — no email/password required.

## Features

- 🔌 **Real-time Connection**: Instant message sending and receiving via REST API and Socket.IO
- 💬 **Bidirectional Messaging**: Supports both sending from OpenClaw and receiving from channels
- 📎 **Media Support**: Upload and download files and media
- 🧵 **Thread Support**: Handle threads and replies
- 👍 **Reactions**: Add and remove reactions on messages
- ⌨️ **Typing Indicator**: Display when OpenClaw is composing a reply
- 📊 **Rich Rendering**: Tables, syntax-highlighted code blocks, LaTeX math
- 🔑 **Token Auth** *(AI·Collab fork only)*: Accepts a pre-issued JWT directly — no email/password sign-in needed

## Requirements

- [OpenClaw](https://docs.openclaw.ai/)
- Open WebUI with Channels feature enabled

---

## Installation

### Recommended: Ask OpenClaw

Tell OpenClaw:

```
https://github.com/dl4rce/openclaw-open-webui-channels
I want to use this plugin
```

OpenClaw will automatically clone the repository and install it.

### Manual Installation

```bash
git clone https://github.com/dl4rce/openclaw-open-webui-channels.git
openclaw plugins install ./openclaw-open-webui-channels
```

---

## Setup for AI·Collab

AI·Collab automatically creates a dedicated bot account and agent channel for you.
You only need to copy the token and channel ID into your OpenClaw config.

### Step 1 — Get your Bot Token and Channel ID

1. Go to **aicollab.app → Account → Arbeitsgruppen**
2. If you haven't set up OpenClaw yet, click **+ OpenClaw** — the bot account and channel are created automatically
3. On the **OpenClaw** group card, click `⋮` → **Token erneuern** (Refresh Token)
4. Copy the **Bot OWUI Token** (full JWT string)
5. Note the **Channel ID** from the Kanal-URL: `chat.aicollab.app/channels/<CHANNEL-ID>`

### Step 2 — Configure OpenClaw

Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "open-webui": {
      "enabled": true,
      "baseUrl": "https://chat.aicollab.app",
      "email": "",
      "password": "",
      "token": "<paste your Bot OWUI Token here>",
      "channelIds": ["<your Channel ID>"],
      "requireMention": true
    }
  }
}
```

> **`token`** takes priority over `email`/`password` — leave those as empty strings.
> **`requireMention: true`** is strongly recommended so OpenClaw only responds when @mentioned.

### Step 3 — Restart OpenClaw

```bash
openclaw gateway restart
```

### Step 4 — Verify

Open the channel via the **Kanal öffnen** button on your OpenClaw group card, @mention the bot, and send a message. OpenClaw should respond.

### Token Renewal

The JWT is valid for **14 days**. When it expires:

1. Click `⋮` → **Token erneuern** on the OpenClaw group card
2. Copy the new token
3. Replace the `token` value in `~/.openclaw/openclaw.json`
4. `openclaw gateway restart`

---

## Setup for self-hosted Open WebUI (email/password)

If you are running your own Open WebUI instance without AI·Collab's SSO, use the original email/password method:

### 1. Create a bot user in Open WebUI

1. Go to **Admin Panel → Users → +**
2. Create a user, e.g. `openclaw-bot@yourdomain.com`
3. Add the bot user to the channels you want OpenClaw to monitor

### 2. Configure OpenClaw

```json
{
  "channels": {
    "open-webui": {
      "enabled": true,
      "baseUrl": "http://your-server:3000",
      "email": "openclaw-bot@yourdomain.com",
      "password": "your-password",
      "channelIds": [],
      "requireMention": true
    }
  }
}
```

---

## ⚠️ Security Notice

Sender filtering (allow lists) is not yet implemented. Anyone with access to the connected channel can send instructions to OpenClaw. Only use this plugin in channels accessible to trusted users.

---

## Troubleshooting

Tell OpenClaw via another interface (WebUI, TUI, etc.):

```
The Open WebUI Channels plugin isn't working. Debug it
```

OpenClaw will check logs and configuration automatically.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

## Credits

Original plugin by [Skyzi000](https://github.com/skyzi000/openclaw-open-webui-channels).
Token-auth patch by [dl4rce / AI·Collab](https://github.com/dl4rce).

## Links

- [This fork (AI·Collab)](https://github.com/dl4rce/openclaw-open-webui-channels)
- [Upstream repository](https://github.com/skyzi000/openclaw-open-webui-channels)
- [OpenClaw Documentation](https://docs.openclaw.ai/)
- [AI·Collab](https://aicollab.app)
