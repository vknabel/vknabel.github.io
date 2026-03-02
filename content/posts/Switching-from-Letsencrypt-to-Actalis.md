---
date: '2026-03-02T16:41:56+01:00'
title: "Switching From Let's Encrypt to Actalis"
tags:
  - hosting
  - web
---

In my ongoing efforts to reduce the reliance on US companies and services, I decided from Let's Encrypt to the Italian Actalis.
Sure, Let's Encrypt works fine, is non-profit and had a huge impact on today's internet security, but nonetheless it is still US based and required to comply with US law and government requests.
This could also include breaking the chain of trust for certificates while prohibiting to share this information with the public.

Actalis, on the other hand, complies to European laws, regulations and standards.

I operate a Kubernetes cluster with [cert-manager](https://cert-manager.io/) and DNS01 challenges. Actalis provides these too, making the switch fairly easy.

1. Create an Actalis account.
2. Copy your ACME Key ID and the HMAC.
3. Create a new secret in Kubernetes with these values.
4. Create a new `Issuer` or `ClusterIssuer` in Kubernetes, referencing the secret created in step 3.
5. Reference the new issuer in your `Certificate` resources.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: actalis-eab
  namespace: cert-manager
stringData:
  # no trailing `=` in the HMAC
  hmac: "$YOUR_HMAC"

---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: actalis-prod
spec:
  acme:
    email: "$YOUR_EMAIL"
    server: https://acme-api.actalis.com/acme/directory
    privateKeySecretRef:
      name: actalis-dns01-account-key
    externalAccountBinding:
      keyID: "$YOUR_KEY_ID"
      keySecretRef:
        name: actalis-eab
        key: hmac
    solvers: # if you are switching, just keep it as is
      - dns01: # due to my setup only DNS01 challenges make sense
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-credentials
              key: api-token
```

Perfect, now we've got Actalis set up and we can start issuing certificates.

But there is one downside: Actalis does not support multiple domains per certificate in the free plan.
Splitting these into multiple certs and secrets does solve this fairly easily though.

I understand if this is a deal breaker for some, but in the end, these are just a few lines that are simple and easy to maintain.

```yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: first-domain
spec:
  secretName: first-domain-tls
  issuerRef:
    name: actalis-prod
    kind: ClusterIssuer
  dnsNames:
    - first.domain # only one dns name supported
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: second-domain
spec:
  secretName: second-domain-tls
  issuerRef:
    name: actalis-prod
    kind: ClusterIssuer
  dnsNames:
    - second.domain # and here is the second one
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: both-domains
spec:
  # here we need to supply both certs
  tls:
    - secretName: first-domain-tls
      hosts:
        - first.domain
    - secretName: second-domain-tls
      hosts:
        - second.domain
  # the rules stay untouched
  rules:
    - host: first.domain
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: service-http
                port:
                  name: http
    - host: second.domain
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: service-http
                port:
                  name: http

```

And that's it! For more services and ideas you could get rid of big tech and the US, check out [Sovereignity](/sovereignity).
