// Teams' IdleTracker (bundle module 955598, core-services-client-state) listens for
// bubbling "mousemove" on the window, never checks isTrusted, and flips to Inactive
// after appIdleTimeoutInMs = 300000. A synthetic event therefore resets the timer.
const tick = () => document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
tick();
setInterval(tick, 60_000);
