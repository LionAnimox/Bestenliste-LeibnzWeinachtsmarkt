// Supabase-Setup
const SUPABASE_URL = "https://gbegxojbypbgbmdzkgoz.supabase.co/
"; // Ersetze durch deine URL
const SUPABASE_KEY = "iI6eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZImdiZWd4b2pieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA"; // Ersetze durch deinen API-Schlüssel
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const password = "7D"; // Passwort für Admin-Zugriff

const leaderboardTable = document.getElementById('leaderboard');
const tableBody = document.getElementById('tableBody');
const addPlayerForm = document.getElementById('addPlayerForm');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('password');
const actionHeader = document.getElementById('actionHeader');

// Tabelle laden
async function loadLeaderboard() {
  const { data, error } = await supabase.from('leaderboard').select('*');

  if (error) {
    console.error(error);
    return;
  }

  tableBody.innerHTML = '';

  data.sort((a, b) => b.score - a.score).forEach((entry, index) => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = index + 1;
    row.insertCell(1).textContent = entry.name;
    row.insertCell(2).textContent = entry.score;

    if (addPlayerForm.style.display !== 'none') {
      const deleteCell = row.insertCell(3);
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Löschen';
      deleteButton.onclick = () => deletePlayer(entry.id);
      deleteCell.appendChild(deleteButton);
    }
  });
}

// Spieler hinzufügen
async function addToLeaderboard(name, score) {
  const { error } = await supabase.from('leaderboard').insert([{ name, score }]);
  if (error) {
    console.error(error);
  }
  loadLeaderboard();
}

// Spieler löschen
async function deletePlayer(id) {
  const { error } = await supabase.from('leaderboard').delete().eq('id', id);
  if (error) {
    console.error(error);
  }
  loadLeaderboard();
}

// Passwort-Überprüfung
passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (passwordInput.value === password) {
    addPlayerForm.style.display = 'block';
    actionHeader.style.display = 'table-cell';
    loadLeaderboard();
  } else {
    alert('Falsches Passwort');
  }
});

// Spieler hinzufügen Event
addPlayerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('playerName').value;
  const score = parseInt(document.getElementById('playerScore').value);
  addToLeaderboard(name, score);
  document.getElementById('playerName').value = '';
  document.getElementById('playerScore').value = '';
});

// Tabelle initial laden
loadLeaderboard();

