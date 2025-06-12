import index from "../view/index.html";
// import path from "node:path";

// let { PORT, APP_PATH, APP_PACKAGED } = Object.fromEntries(
//   Object.entries(import.meta.env).map((x) => [x[0], JSON.parse(x[1] as any)]),
// );
// console.log("worker", {
//   PORT,
//   APP_PATH,
//   APP_PACKAGED,
// });

const server = Bun.serve({
  // port: PORT,
  port: 3001,
  routes: {
    "/": index,
    // ...(APP_PACKAGED
    //   ? {}
    //   : await import("./workers/routes.ts").then((x) => x.default)),

    "/api/*": new Response("api from worker"),
  },

  // async fetch(req) {
  //   const url = new URL(req.url);
  //   const filename = path.join(
  //     APP_PATH,
  //     "view",
  //     url.pathname !== "/" ? url.pathname : "/index.html",
  //   );
  //   // console.log({ url, filename });
  //   // console.log(req.headers.toJSON());
  //   const file = Bun.file(filename);
  //   const exists = await file.exists();
  //   if (!exists) return new Response(null, { status: 404 });
  //   return new Response(await file.text(), {
  //     headers: { "Content-Type": file.type },
  //   });
  // },

  // development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`🚀 Server running at ${server.url}`);

// declare var self: Worker;
