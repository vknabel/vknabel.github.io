---
title: Overriding internal Hugo templates
date: 2022-07-24
tags: [web]
---

You can override internal Hugo templates with your own templates.

Simply create it in the `layouts` folder and you are done!

That's how I overrode `_internal/google_analytics_async.html` with my own template - to not use GA!
That way I could avoid forking [athul's archie](https://github.com/athul/archie.git) template.
