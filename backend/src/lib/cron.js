import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

const job = new CronJob("*/14 * * * *", function () {
  const base = process.env.BACKEND_URL;

  if (!base) {
    console.error("BACKEND_URL is not defined");
    return;
  }

  const url = new URL("/health", base).href;

  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (error) => {
      console.error("Error while sending request", error);
    });
});

export default job;