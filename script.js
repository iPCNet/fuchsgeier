async function loadConfig() {
  const res = await fetch('config.json');
  if (!res.ok) throw new Error('Config konnte nicht geladen werden');
  return res.json();
}

async function loadJobs() {
  const res = await fetch('jobs.json');
  if (!res.ok) {
    // Erste Version: jobs.json existiert evtl. noch nicht
    return { jobs: [] };
  }
  return res.json();
}

async function init() {
  const jobsContainer = document.getElementById('jobs');
  const kwContainer = document.getElementById('keywords');

  try {
    const [config, jobsData] = await Promise.all([loadConfig(), loadJobs()]);

    // Stichwörter anzeigen
    kwContainer.textContent = (config.search_terms || []).join(', ');

    // Jobs anzeigen
    const jobs = jobsData.jobs || [];
    if (jobs.length === 0) {
      jobsContainer.textContent = 'Noch keine Jobs gefunden.';
      return;
    }

    jobsContainer.innerHTML = '';
    jobs.slice(0, 20).forEach(job => {
      const div = document.createElement('div');
      div.className = 'job';
      div.innerHTML = `
        <div class="job-title">${job.title || 'Ohne Titel'}</div>
        <div class="job-meta">
          ${(job.company || '')} ${(job.location ? ' · ' + job.location : '')}
        </div>
        <a href="${job.url}" target="_blank">Details ansehen</a>
      `;
      jobsContainer.appendChild(div);
    });

  } catch (e) {
    jobsContainer.textContent = 'Fehler beim Laden 😿';
    console.error(e);
  }
}

init();
