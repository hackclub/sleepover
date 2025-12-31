export async function getSlackUserInfo(slackId: string) {
  const token = process.env.SLACK_BOT_TOKEN;
  
  if (!token || !slackId) {
    return null;
  }

  const response = await fetch(`https://slack.com/api/users.info?user=${slackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Slack API error:", response.status);
    return null;
  }

  const data = await response.json();

  if (!data.ok) {
    console.error("Slack API error:", data.error);
    return null;
  }

  return {
    display_name: data.user.profile.display_name || data.user.profile.real_name || data.user.name,
    avatar_url: data.user.profile.image_512 || data.user.profile.image_192 || data.user.profile.image_72,
  };
}
