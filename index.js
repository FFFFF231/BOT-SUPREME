const { bot } = require("./structures/client");

new bot();

const ignoredErrors = [10008];

function shouldIgnore(error) {
  return error && ignoredErrors.includes(error.code);
}

process.on("unhandledRejection", (reason, promise) => {
  if (shouldIgnore(reason)) return;
  console.error("[antiCrash] Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  if (shouldIgnore(err)) return;
  console.error("[antiCrash] Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", (err) => {
  if (shouldIgnore(err)) return;
  console.error("[antiCrash] Uncaught Exception Monitor:", err);
});

process.on("multipleResolves", (type, promise, reason) => {
  if (shouldIgnore(reason)) return;
  console.error("[antiCrash] Multiple Resolves:", type, reason);
});
