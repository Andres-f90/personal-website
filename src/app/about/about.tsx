import React from "react";

const About = () => {
  return (
    <div>
      <WhoAmI />
      <Skills />
    </div>
  );
};

const WhoAmI = () => {
  return (
    <div>
      <h1> Who is Andres </h1>
      <p>
        Hello I am an economics student from the UMNG (Nueva Granada Military
        University)
      </p>
    </div>
  );
};

const skills = [
  { name: "Econometrics", rating: 4.5 },
  { name: "Statistics", rating: 4 },
  { name: "Python", rating: 3 },
  { name: "Excel", rating: 4 },
];

const Skills = () => {
  return (
    <section className="skills-section">
      <h2 className="skills-title">My skills</h2>

      <ul className="skills-list">
        {skills.map((skill, idx) => (
          <li key={idx} className="skill-row">
            <span className="skill-name">{skill.name}</span>

            <div className="stars">
              <div className="stars-empty">★★★★★</div>
              <div
                className="stars-filled"
                style={{ width: `${Math.min(100, (skill.rating / 5) * 100)}%` }}
              >
                ★★★★★
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default About;
