type Job = {
    company:    string;
    role:       string;
    period:     string;
    bullets:    string[];
    tags?:      string[];
}

const jobs: Job[] = [
    {
        company: "DataEdge Kft.",
        role: "Junior Developer (Intern)",
        period: "2025 Jan — 2025 Oct",
        bullets: [
        "Developed Python scripts using FastAPI, SQLAlchemy, and Pandas to automate data validation and reporting",
        "Integrated APIs between systems such as Hermes, Atlas, and TEDI, handling both REST and file-based data exchange",
        "Designed SQL queries and views in PostgreSQL, optimizing data consistency and performance",
        "Built and refactored Python CLI utilities for internal teams, improving code structure and maintainability",
        "Collaborated with colleagues through Git, Docker, and VS Code Remote Containers for environment parity",
        "Used Postman and Swagger UI for API testing and documentation",
        "Assisted in debugging data pipelines and automating reconciliation tasks using Pandas and Excel exporters",
        "Participated in migrating old PHP reports to modern Python-based scripts",
        ],
        tags: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Pandas", "Go", "Docker", "Git", "Postman", "Swagger UI", "VS Code", "Streamlit", "Linux"]
    },
];

export default function About() {
    return (
    <section id="about" className="section-about">
      <div className="about-noise" />
      <div className="container about-wrap">
        <div className="about-photo">
          <img src="/profile.jpg" alt="Portrait" loading="lazy" />
        </div>

        <div className="about-content">
          <h3>About</h3>
          <p className="about-lead">
            Backend- and data science developer.
            Python/Go, SQL, FastAPI, Pandas.
          </p>

          <div className="about-cards">
            {jobs.map((j, i) => (
              <article className="about-card" key={i}>
                <div className="about-card__head">
                  <span className="about-card__period">{j.period}</span>
                  <div className="about-card__company">{j.company}</div>
                  <h4>{j.role}</h4>
                </div>

                <ul className="about-card__list">
                  {j.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>

                {j.tags && (
                  <div className="about-card__tags">
                    {j.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}