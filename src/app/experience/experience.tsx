import { title } from "process";
import React from "react";

const Experience = () => {
  return (
    <div>
      <ProjectsBuilt />
    </div>
  );
};

const projects = [
  {
    title: "Coming soon",
    description: "This project will be based on Data Science and Econometrics",
  },
];

const ProjectsBuilt = () => {
  return (
    <div>
      <h1>My projects are:</h1>
      <section className="pr1">
        <h2 className="DSaEiB">First project</h2>
        <div className="project-grid">
          {projects.map((project, idx) => (
            <article key={idx} className="project-card">
              <div className="project-image">Project image</div>
              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Experience;
