# Changelog

## [0.4.2-aicollab.3] - 2026-04-21 (AI·Collab fork)

### Fixed

- **JWT auto-decode**: `getAuthToken` now decodes the JWT payload to extract `userId` (`id`/`sub` claim) and `userName` (`name` claim) automatically — no need to configure `userId` manually when using token-auth
- **Mention detection**: bot name now comes from the decoded JWT (`name` claim) rather than the user-configured `account.name` field, which is rarely set. Fallback chain: JWT name → `account.name` config → no plain-text match. This fixes the case where the first message worked (bot replied once) but subsequent messages were silently dropped

---

## [0.4.2-aicollab.2] - 2026-04-21 (AI·Collab fork)

### Fixed

- **`resolveOpenWebUIAccount`**: read `token` field from channel config (was silently ignored)
- **`getAccountFromResolved`**: pass `token` through to the API layer
- **`configured` check**: `Boolean(baseUrl && (token || (email && password)))` — plugin now correctly marks itself as configured when only a token is provided (no email/password)
- **Mention detection**: Open WebUI sends channel messages as plain text; `<@U:USER_ID>` tags only appear in rendered HTML and are never in the Socket.IO event payload. Detection now also matches plain-text `@<display-name>` (case-insensitive) so `requireMention: true` works correctly

### Added

- `token?: string` field on `OpenWebUIChannelConfig` and `ResolvedOpenWebUIAccount` interfaces

---

## [0.4.2-aicollab.1] - 2026-04-21 (AI·Collab fork)

> Forked from [skyzi000/openclaw-open-webui-channels](https://github.com/skyzi000/openclaw-open-webui-channels) v0.4.2.

### Added

- **Token-based authentication** (`account.token`): if a pre-issued JWT is supplied in the account config, `getAuthToken` uses it directly and skips the email/password `signin` call entirely. Required for platforms that use SSO (e.g. AI·Collab) where storing a bot password is not possible or desirable.
- Updated README with full AI·Collab setup guide (token renewal flow, channel ID lookup, `requireMention` guidance).

### Changed

- Package name: `@skyzi000/open-webui` → `@dl4rce/open-webui`
- Repository and homepage URLs point to the fork at `github.com/dl4rce`

---

## [0.4.2] - 2026-02-18

### Fixed

- Stop leaking implicit `parentId` from thread context in handleAction send — Open WebUI hides messages with a `parent_id` that doesn't exist in the target channel
- Align package name (`@skyzi000/open-webui`) with plugin id for standard installation

## [0.4.1] - 2026-02-15

### Fixed

- Strip `open-webui:` prefix from channel target in sendText/sendMedia
- Use `createReplyDispatcherWithTyping` API for reply dispatch
- Throw when all media uploads fail with no text content to deliver

### Changed

- Point `docsPath` to GitHub README
- Remove metadata (`aliases`, `order`, `detailLabel`)

## [0.4.0] - 2026-02-12

### Added

- Dynamic `peer.kind` based on Open WebUI channel type (`standard` → channel, `group` → group, `dm` → dm)
- DM support: bypass `channelIds` filter and `requireMention` check (matching Discord plugin behavior)
- `ChatType` mapping (`direct` / `channel` / `group`)

### Breaking Changes

- **Session keys for Standard channels have changed.** `peer.kind` changed from the fixed value `"group"` to dynamic values (e.g. `"channel"`), so session history from v0.3.x will not carry over.

## [0.3.0] - 2026-02-11

### Added

- Thread session isolation: separate sessions per thread using `{channelId}:{parentId}`
- Thread parent context injection: inject parent message into agent context for threads
- Reaction support: add/remove reactions via `react` action
- Initial release: OpenClaw plugin for Open WebUI Channels integration
  - REST API & Socket.IO real-time communication
  - Bidirectional messaging with media support
  - Thread and typing indicator support
