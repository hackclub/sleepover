import Link from "next/link";

export default function ProjectList({ projects }: { projects: any[] }) {
    return (
      <div className="w-full">
        {projects.map((p: any) => (
          <article key={p.id} className="flex">
            <h2>{p.name}</h2>
            <p>{p.desc}</p>
            <Link href={`/portal/forms/ship/${p.id}`}><p>Ship Project</p></Link>
          </article>
        ))}
      </div>
    )
  }