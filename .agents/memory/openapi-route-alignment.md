---
name: OpenAPI route alignment
description: A durable debugging rule for the shared OpenAPI, generated client, and Express API boundary.
---

The OpenAPI document is the route contract for this workspace: the generated React client follows its path and method exactly, while the Express implementation must expose the same route.

**Why:** A smoke test initially targeted a plausible status sub-route instead of the generated resource PUT route, which made a working implementation look broken.

**How to apply:** For any API 404, inspect the generated operation URL and HTTP method first, then compare it with the server route and regenerate only when the OpenAPI contract itself changes.