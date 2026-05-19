const profileName = document.querySelector("#profile-name");
const profileSummary = document.querySelector("#profile-summary");
const profileRole = document.querySelector("#profile-role");
const profileLocation = document.querySelector("#profile-location");
const profileEmail = document.querySelector("#profile-email");
const profilePhone = document.querySelector("#profile-phone");
const skillsList = document.querySelector("#skills-list");
const projectGrid = document.querySelector("#project-grid");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function renderProfile(profile) {
  profileName.textContent = profile.name;
  profileSummary.textContent = profile.summary;
  profileRole.textContent = profile.role;
  profileLocation.textContent = profile.location;
  profileEmail.textContent = profile.email;
  profilePhone.textContent = profile.phone;

  skillsList.innerHTML = profile.skills
    .map((skill) => `<span class="skill-pill">${skill}</span>`)
    .join("");
}

function renderProjects(projects) {
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tech-list">
            ${project.tech.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${project.link}">Live Demo</a>
            <a href="${project.github}">GitHub</a>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadPortfolio() {
  try {
    const profile = await requestJson("/api/profile");
    const projects = await requestJson("/api/projects");

    renderProfile(profile);
    renderProjects(projects);
  } catch (error) {
    projectGrid.innerHTML = `<p>${error.message}</p>`;
  }
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Sending...";

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await requestJson("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    formStatus.textContent = data.message;
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

loadPortfolio();
async function loadProjects() {
  try {
    const response = await fetch("/api/projects");
    const projects = await response.json();

    const container = document.getElementById("projects-container");

    container.innerHTML = "";

    projects.forEach(project => {
      const card = document.createElement("div");

      card.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <p><strong>Tech:</strong> ${project.tech.join(", ")}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

loadProjects();