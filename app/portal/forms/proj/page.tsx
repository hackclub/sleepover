import { createProject } from "@/app/forms/actions/createProject";
import { getUserInfo } from "@/lib/auth";
import { getHackProjects } from "@/lib/hackatime";
import { cookies } from "next/headers";

export default async function ProjectForm() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  const value = sessionCookie.value;
  const accessToken = JSON.parse(value).accessToken;

  const userinfo = await getUserInfo(accessToken);
  const slackId = userinfo.identity.slack_id;

  const projects = await getHackProjects(slackId);

  const defaultProject = projects?.[0] ?? "";

  return (
    <form action={createProject} className="space-y-3">
      <div>
        <label className="block">Name</label>
        <input name="name" required className="border p-2 w-full" />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea name="desc" className="border p-2 w-full" />
      </div>

      <label className="block">
        Choose an option:
        <select
          name="project"
          defaultValue={defaultProject}
          className="border p-2 w-full"
          required
        >
          {projects.map((option) => {
            const value = String(option);
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </label>

      <button type="submit" className="border px-3 py-2">
        Add project
      </button>
    </form>
  );
}
