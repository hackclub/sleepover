import "server-only";
import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
if (!token) throw new Error("Missing SLACK_BOT_TOKEN");

const client = new WebClient(token);

async function getSlackIdByEmail(email) {
  const res = await client.users.lookupByEmail({ email });
  return res.user.id;
}

async function openConversationWithEmail(email) {
  const userId = await getSlackIdByEmail(email);
  const convo = await client.conversations.open({ users: userId });
  return convo.channel.id;
}

export async function projectReviewMessage(email, message) {
  const channelId = await openConversationWithEmail(email);

  await client.chat.postMessage({
    channel: channelId,
    text: message,            // always include fallback text
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: message }
      }
    ]
    // DO NOT set username/icon here; Slack uses the app’s profile automatically
  });
}