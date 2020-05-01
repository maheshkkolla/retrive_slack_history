import express from "express";
import slackApi from "./slack_api.js";

let router = express.Router();

router.get("/channels", async (req, res, next) => {
  const channels = await slackApi.request("https://slack.com/api/conversations.list");
  const groups = await slackApi.request("https://slack.com/api/groups.list");
  res.json([...channels.channels, ...groups.groups].map(({id, name, is_private}) => {
    return {id, name, is_private}
  }));
});


router.get("/history", async (req, res, next) => {
  const channel = req.query.text || req.query.channel_id;
  const history = await slackApi.request("https://slack.com/api/conversations.history", {channel});
  res.json(history.messages.map(({text, thread_ts, reply_count}) => {
    return {text, thread_ts, reply_count};
  }));
});

router.get("/thread_history", async (req, res, next) => {
  const text = req.query.text.split(" ");
  const channel = text[1] || req.query.channel_id;
  const ts = text[0];
  const history = await slackApi.request("https://slack.com/api/conversations.replies", {channel, ts, inclusive: true});
  console.log(history);
  res.json(history.messages.map(({text}) => {
    return {text};
  }));
});


export default router;
