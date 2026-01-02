export async function getUserStats(slack_id: string) {
  const response = await fetch(`https://hackatime.hackclub.com/api/v1/users/${slack_id}/stats?features=projects`, {
    headers: {
      Authorization: `Bearer ${process.env.HACKATIME_API}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}