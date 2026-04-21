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
You only need to copy three values from the AI·Collab dashboard into your OpenClaw config.

### Step 1 — Set up OpenClaw in AI·Collab

1. Go to **[aicollab.app](https://aicollab.app) → Mein Konto (My Account) → Arbeitsgruppen (Workspaces)**
2. Click **+ OpenClaw** — the bot account and channel are created automatically
3. On the **OpenClaw** group card, click `⋮` → **Zugangsdaten** (Access credentials)
4. The dialog shows all three values you need:
   - **Base URL** — the AI·Collab chat server URL
   - **Bot OWUI Token** — your pre-issued JWT (valid 14 days)
   - **Channel ID** — the channel your bot is connected to
5. Click the copy icon next to each value

### Step 2 — Configure OpenClaw

Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "open-webui": {
      "enabled": true,
      "baseUrl": "<Base URL from Zugangsdaten dialog>",
      "email": "",
      "password": "",
      "token": "<Bot OWUI Token from Zugangsdaten dialog>",
      "channelIds": ["<Channel ID from Zugangsdaten dialog>"],
      "requireMention": true
    }
  }
}
```

> **`token`** takes priority over `email`/`password` — leave those as empty strings.  
> **`requireMention: true`** is recommended so OpenClaw only responds when @mentioned by name (e.g. `@OpenClaw`).

### Step 3 — Restart OpenClaw

```bash
openclaw gateway restart
```

### Step 4 — Verify

Open the channel via the **Kanal öffnen** (Open Channel) button on the OpenClaw group card, @mention the bot, and send a message. OpenClaw should respond within a few seconds.

### Token Renewal

The JWT is valid for **14 days**. A warning is shown in the Zugangsdaten dialog when it is about to expire. To renew:

1. On the OpenClaw group card, click `⋮` → **Zugangsdaten**
2. Click the refresh icon next to the token field to issue a fresh JWT
3. Copy the new token
4. Replace the `token` value in `~/.openclaw/openclaw.json`
5. Run `openclaw gateway restart`

### Removing OpenClaw

To delete the bot account and channel, click `⋮` → **OpenClaw entfernen** on the group card. This removes the bot user, the channel, and all stored credentials.

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
