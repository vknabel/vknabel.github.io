---
title: 'WKWebView Configuration Cookies not working'
date: '2022-02-21'
tags: [swift, web]
---

Cookies in WKWebView are broken. When manually setting a Cookie using the Configuration, it will be ignored by the web view.

**Workaround:** add a `UserScript` with the following code:

```javascript
document.cookies = 'cookie_optin=essential:1|analytics:0'
```

That's a great way to automatically reject Cookies and especially to disable tracking to either propagate the user's ATT decision or to avoid implementing ATT in the beginning.
