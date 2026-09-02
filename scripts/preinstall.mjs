import { existsSync, unlinkSync } from "node:fs";

for (const lockFile of ["package-lock.json", "yarn.lock"]) {
  if (existsSync(lockFile)) {
    unlinkSync(lockFile);
  }
}

if (!process.env.npm_config_user_agent?.startsWith("pnpm/")) {
  console.error("Use pnpm instead");
  process.exit(1);
}
