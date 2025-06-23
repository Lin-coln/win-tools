import Index from "../pages/index.html";

const server = Bun.serve({
  // port: PORT,
  port: 3001,
  routes: {
    "/*": Index,
    "/api/*": new Response("api from worker"),
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
