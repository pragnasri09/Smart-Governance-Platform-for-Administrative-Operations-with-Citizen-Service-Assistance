import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "dist", "public");
const port = Number(process.env.PORT ?? 5173);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = createServer((request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const filePath = normalize(join(root, requestedPath === "/" ? "index.html" : requestedPath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    const fallback = join(root, "index.html");
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(fallback).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving ${root} on port ${port}`);
});
