import { getSession } from "./session";

const start_date = "2026-01-01";
const end_date = "2026-04-05";

export async function getUsernameFromEmail(email: string) {
  const response = await fetch("https://hackatime.hackclub.com/api/admin/v1/user/get_user_by_email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HACKATIME_API_KEY}`
      },
      body: JSON.stringify({ email: email })
    });

    if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}

export async function getUserStats(slack_id: string) {

  const response = await fetch(`https://hackatime.hackclub.com/api/v1/users/${slack_id}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`, {
    headers: {
      Authorization: `Bearer ${process.env.HACKATIME_API}`,
    },
  });

  if (!response.ok) {
    console.log("not working with slack, trying with email")

    const session = await getSession()
    const email = session.email
    const userid = (await getUsernameFromEmail(email)).user_id

    const response2 = await fetch(`https://hackatime.hackclub.com/api/v1/users/${userid}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`, {
    headers: {
      Authorization: `Bearer ${process.env.HACKATIME_API}`,
    },
  });

    if (!response2.ok) {
      throw new Error("Failed to get user info.");
    }

    return response2.json()

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

export async function getMultipleProjectHours(slack_id: string, projectNames: string[]): Promise<number> {
  const data = await getUserStats(slack_id);
  const projects = data.data.projects;

  let totalHours = 0;
  for (const projectName of projectNames) {
    const project = projects.find((p: any) => p.name === projectName);
    if (project) {
      totalHours += project.hours + project.minutes / 60;
    }
  }
  return totalHours;
}

export function parseHackatimeProjects(hackatime_name: string | null | undefined): string[] {
  if (!hackatime_name) return [];

  // Try parsing as JSON array
  try {
    const parsed = JSON.parse(hackatime_name);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON, treat as single project name
  }

  // Single string - wrap in array for backward compatibility
  return [hackatime_name];
}