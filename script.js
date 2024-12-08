// Deine Supabase-URL und der API-Schlüssel
const SUPABASE_URL = "https://gbegxojbypbgbmdzkgoz.supabase.co/";  // Ersetze mit deiner URL
const SUPABASE_KEY = "iI6eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZImdiZWd4b2pieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA";  // Ersetze mit deinem API-Schlüssel

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Daten aus Supabase abrufen und in die Tabelle einfügen
async function loadLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard') // Tabellenname
    .select('*');
  
  if (error) {
    console.error(error);
    return;
  }

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = ''; // Vorherige Einträge entfernen

  data.forEach((entry, index) => {
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = index + 1;
    newRow.insertCell(1).textContent = entry.name;
    newRow.insertCell(2).textContent = entry.score;
  });
}

// Eintrag zu Supabase hinzufügen
async function addToLeaderboard(name, score) {
  const { data, error } = await supabase
    .from('leaderboard') // Tabellenname
    .insert([
      { name: name, score: score }
    ]);
  
  if (error) {
    console.error(error);
    return;
  }
  
  loadLeaderboard();  // Tabelle neu laden, um den neuen Eintrag anzuzeigen
}

// Event listener für das Formular
document.getElementById('addPlayerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('playerName').value;
  const score = document.getElementById('playerScore').value;

  addToLeaderboard(name, score);
  document.getElementById('playerName').value = '';
  document.getElementById('playerScore').value = '';
});

// Lade die Bestenliste beim Start
loadLeaderboard();
