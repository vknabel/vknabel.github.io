---
title: 24hrs format for html inputs in Firefox
date: 2023-11-09
tags: [web]
---

My system language on my linux machine is set to English, but as a German raised with 24-hour days, I simply cannot wrap my head around to get the 12-hours `am`/`pm` format intuitively. By the time I learned that `am` is in the morning and `pm` is in the evening. But when it comes to `12:00` as the mid of the day and `0:00` in the night, I'm lost.

Of course I have already set the time format to 24-hours in my system settings (Ubuntu `Date & Time > Time Format` set to `24-hour`), but Firefox still uses the 12-hours format for html inputs with `type="time"`.

As a solution you open [about:config](about:config) and set `intl.regional_prefs.use_os_locales` to `true`.
Now simple `<input type="time">` will use the 24h format!
