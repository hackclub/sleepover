const SLEEPOVER_START_DATE = "2026-01-01";

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

export async function getHackProjects(slack_id: string) {
    const data = await getUserStats(slack_id);
    const projects = data.data.projects;
    return projects.map((p: any) => p.name);
  }

export async function isHackatime(slack_id: string) {
  const data = await getUserStats(slack_id);
  const error = data.data.error
  if (error) {
    return false;
  } else {
    return true;
  }
}

export async function getProjectHours(slack_id: string, name: string) {
    const data = await getUserStats(slack_id);
    const projects = data.data.projects;

    for (const project of projects) {
      if (project.name === name) {
        const hours = project.hours;
        const minutes = project.minutes;
        return hours + minutes / 60;
      }
    }
    return 0;
  }