# Teams Always Available

<img src="icons/128.png" width="96" alt="Teams Always Available icon">

Firefox/LibreWolf add-on that keeps the Microsoft Teams **web** client presence at *Available* — without moving your mouse, typing anything, or unlocking your screen.

## Why it works — measured, not guessed

The Teams web client bundles its own idle tracker. From the live app shell (`teams.microsoft.com/v2`, bundle module `955598`, namespace `core-services-client-state`):

| Fact | Evidence |
|---|---|
| Watched events | `["scroll","DOMMouseScroll","mousewheel","touchstart","touchmove","mousemove","keydown"]`, listeners attached to `window` |
| Effect of one event | state → `Active`, idle timer restarts, activity callback fires |
| Event origin check | none — no `isTrusted` test anywhere in the class |
| Idle timeout | `appIdleTimeoutInMs: 300000` (5 min), `appLongIdleTimeoutInMs: 1200000` |
| Presence effect | client state `Inactive` → presence activity `Inactive` → UI label `me_control_presence_activity_away` |

So a single synthetic, bubbling `mousemove` per minute is enough to stay `Available`. `keydown` is deliberately not used: it would be untrusted input into an app with live keyboard shortcuts for no benefit.

## Install

The add-on is unsigned, so the browser must not require signatures (Firefox release builds lock that pref; LibreWolf does not):

```js
// <profile>/user.js
user_pref("xpinstall.signatures.required", false);
```

Then either use *about:addons → gear → Install Add-on From File…*, or drop the XPI into `<profile>/extensions/teams-always-available@steimerbyte.xpi` and restart.

## Verify

1. Open Teams web, leave mouse and keyboard alone for 6 minutes.
2. Check your status from the Teams mobile app: still **Available**.
3. Control run: disable the add-on, reload the tab, 5 minutes idle → **Away**.

## Limits

- Web client only: `teams.microsoft.com`, `teams.cloud.microsoft`, `teams.live.com`. The desktop client is unaffected.
- Presence is a server-side decision; if Microsoft starts verifying real input server-side, step 2 of *Verify* will show it.
- Tied to the client build observed 2026-11.

## Build

```sh
zip -r teams-always-available.xpi manifest.json keepalive.js icons/16.png icons/32.png icons/48.png icons/96.png icons/128.png
```

## License

MIT
