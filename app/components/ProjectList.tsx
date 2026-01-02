export default function ProjectList({ projects }: { projects: any[] }) {
    return (
      <div>
        {projects.map((p: any) => (
          <article key={p.id}>
            <h2>{p.name}</h2>
            <p>{p.desc}</p>
            <p>{p.hours}</p>
          </article>
        ))}
      </div>
    )
  }