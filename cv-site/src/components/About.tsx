import { useEffect, useState } from "react";

type Job = {
  id: number;
  company: string;
  position: string;
  period: string;
  bullets: string[];
  tags?: string[];
};

export default function About() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoint =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "") + "/jobs";

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        const payload: Job[] = await res.json();
        setJobs(payload);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch jobs", err);
          setError("Nem sikerült betölteni a tapasztalatokat.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [endpoint]);

  const hasJobs = jobs.length > 0;

  return (
    <section id="about" className="section-about">
      <div className="about-noise" />
      <div className="container about-wrap">
        <div className="about-photo">
          <img
            src={`${import.meta.env.BASE_URL}profile.jpg`}
            alt="Portrait"
            loading="lazy"
            width={800}
            height={1000}
          />
        </div>

        <div className="about-content">
          <h3>About</h3>
          <p className="about-lead">
            Backend- and data science developer. Python/Go, SQL, FastAPI, Pandas.
          </p>

          <div className="about-cards">
            {loading && <p>Betöltés...</p>}
            {error && !loading && <p className="about-error">{error}</p>}
            {!loading && !error && !hasJobs && (
              <p>Még nincsenek megjeleníthető tapasztalatok.</p>
            )}
            {hasJobs &&
              jobs.map((job) => (
                <article className="about-card" key={job.id}>
                  <div className="about-card__head">
                    <span className="about-card__period">{job.period}</span>
                    <div className="about-card__company">{job.company}</div>
                    <h4>{job.position}</h4>
                  </div>

                  <ul className="about-card__list">
                    {job.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  {job.tags && job.tags.length > 0 && (
                    <div className="about-card__tags">
                      {job.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
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
