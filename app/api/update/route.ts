import { getSingularProject, getUsersProjects, updateProjectHours } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { getUserStats } from "@/lib/hackatime";
import { cookies } from "next/headers";


export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
  
    if (!sessionCookie) return;
  
    const value = sessionCookie.value;
    const accessToken = JSON.parse(value).accessToken;
  
    const userinfo = await getUserInfo(accessToken);
    const slackId = userinfo.identity.slack_id;
  
    const data = await getUserStats(slackId);
    const projects = data.data.projects;

    console.log(await getUsersProjects(userinfo.identity.id))
  
    for (const project of projects) {
      const found = await getSingularProject(
        userinfo.identity.id,
        project.name
      );
      console.log(project)
    if (found) {
        console.log(`updated ${project.name} to have ${project.hours} from ${found.get("hours")}`)
        updateProjectHours(found.id, project.hours)
    }
    }
  }