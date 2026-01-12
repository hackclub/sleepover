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

export async function getUserSummaries(slack_id: string) {
  const today = new Date().toISOString().split("T")[0];
  const response = await fetch(
    `https://hackatime.hackclub.com/api/v1/users/${slack_id}/summaries?start=${SLEEPOVER_START_DATE}&end=${today}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HACKATIME_API}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get user summaries");
  }

  return response.json();
}

export async function getHackProjects(slack_id: string) {
  try {
    const data = await getUserSummaries(slack_id);
    const projectSet = new Set<string>();

    // Summaries returns an array of daily summaries, each with projects
    if (data.data && Array.isArray(data.data)) {
      for (const day of data.data) {
        if (day.projects && Array.isArray(day.projects)) {
          for (const project of day.projects) {
            projectSet.add(project.name);
          }
        }
      }
    }

    return Array.from(projectSet);
  } catch (error) {
    console.error("Error fetching projects from summaries, falling back to stats:", error);
    // Fallback to original stats endpoint
    const data = await getUserStats(slack_id);
    const projects = data.data.projects;
    return projects.map((p: any) => p.name);
  }
}

export async function isHackatime(slack_id: string) {
  const data = await getUserStats(slack_id);
  console.log("data =", data)
  const error = data.data.error
    if (error) {
      console.log("not undefined")
      return false;
    } else {
      return true;
    }
  
}

export async function getProjectHours(slack_id: string, name: string) {
  try {
    const data = await getUserSummaries(slack_id);
    let totalSeconds = 0;

    // Sum up seconds for the project across all days since Jan 1 2026
    if (data.data && Array.isArray(data.data)) {
      for (const day of data.data) {
        if (day.projects && Array.isArray(day.projects)) {
          for (const project of day.projects) {
            if (project.name === name) {
              totalSeconds += project.total_seconds || 0;
            }
          }
        }
      }
    }

    return totalSeconds / 3600; // Convert seconds to hours
  } catch (error) {
    console.error("Error fetching hours from summaries, falling back to stats:", error);
    // Fallback to original stats endpoint
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
}