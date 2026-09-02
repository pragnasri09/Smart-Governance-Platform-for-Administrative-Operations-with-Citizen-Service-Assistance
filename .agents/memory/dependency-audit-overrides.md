---
name: Dependency audit overrides
description: How this workspace handles vulnerable transitive packages shared by tooling across the pnpm monorepo.
---

When a dependency audit flags packages that are only transitive or development-time dependencies, prefer a workspace-level override to the patched release before changing application libraries.

**Why:** The monorepo shares toolchain dependencies across API, web, code generation, and preview packages; upgrading one direct application package can create unnecessary compatibility risk.

**How to apply:** Confirm the fixed versions from the audit, add narrowly scoped overrides in `pnpm-workspace.yaml`, refresh the lockfile, then rerun typechecks, builds, and the security scanners.