const API = "http://localhost:3001";

const pages = {
  home: document.getElementById("page-home"),
  flights: document.getElementById("page-flights"),
};

const navButtons = document.querySelectorAll(".nav-btn");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");

function setPage(name) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[name].classList.add("active");

  navButtons.forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-page="${name}"]`).classList.add("active");
}

navButtons.forEach(btn => btn.addEventListener("click", () => setPage(btn.dataset.page)));

function render(list) {
  if (!list.length) {
    results.innerHTML = `<p class="muted">No flights found.</p>`;
    return;
  }

  results.innerHTML = list.map(f => `
    <div class="card">
      <div><b>${f.from}</b> → <b>${f.to}</b></div>
      <div>${f.date}${f.time ? ` | ${f.time}` : ""}</div>
      <div>Duration: ${f.duration ?? "-"}</div>
      <div>Seats: ${f.seats} | Price: ${f.price}</div>
      <div class="muted">ID: ${f.id}</div>
    </div>
  `).join("");
}

async function loadFlights(params = {}) {
  const url = new URL(`${API}/flights`);
  Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });

  statusEl.textContent = "Loading...";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    statusEl.textContent = `Loaded: ${data.length}`;
    return data;
  } catch (e) {
    statusEl.textContent = `Error: ${e.message}`;
    return [];
  }
}

document.getElementById("btn-load").addEventListener("click", async () => {
  setPage("flights");
  const data = await loadFlights();
  render(data);
});

document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const date = document.getElementById("date").value;

  setPage("flights");
  const data = await loadFlights({ from, to, date });
  render(data);
});
