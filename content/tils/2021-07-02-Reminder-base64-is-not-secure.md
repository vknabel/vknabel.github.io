---
title: 'Reminder: base64 is not secure!'
date: '2021-07-02T16:17:27Z'
tags: [web]
---

I have never actually seen serious code that's running in production, that uses base64 encoding for password for over a decade.
Today I did.

Here is the not so friendly reminder:

base64 is no encryption or hashing algorithm. You should not use it to encode passwords.
And you should't send the password over HTTP and Basic auth (no HTTPS, not even Digest auth).
Even if you do, trade the password for a token. Don't repeat your mistakes with every single request.
And do not store the password locally. Store an encrypted session key instead.

If you don't follow these basics, delete your code and shut down all your services.
