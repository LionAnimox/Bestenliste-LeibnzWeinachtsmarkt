const supabaseUrl = "https://gbegxojbypbgbmdzkgoz.supabase.co";
const apiToken = "iI6eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZImdiZWd4b2jieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA";

// Funktion zum Abrufen der Bestenliste
async function fetchLeaderboard() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/leaderboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'apikey': apiToken
      }
    });

    if (response.ok) {
      const data = await response.json();
      displayLeaderboard(data);
    } else {
      console.error('Fehler beim Abrufen der Daten:', response.status);
    }
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Funktion zum Anzeigen der Tabelle
function displayLeaderboard(data) {
  const leaderboardTable = document.getElementById('leaderboardTable');
  leaderboardTable.innerHTML = ''; 

  const tableHeader = document.createElement('tr');
  tableHeader.innerHTML = `
    <th>Platz</th>
    <th>Name</th>
    <th>Score</th>
    ${document.getElementById('password').value === "DEIN_ADMIN_PASSWORT" ? '<th>Aktion</th>' : ''}
  `;
  leaderboardTable.appendChild(tableHeader);

  data.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
      ${document.getElementById('password').value === "DEIN_ADMIN_PASSWORT" ? `<td><button class="delete-button" onclick="deletePerson(${entry.id})">Löschen</button></td>` : ''}
    `;
    leaderboardTable.appendChild(row);
  });
}

// Passwortüberprüfung
document.getElementById('submit-password').addEventListener('click', function() {
  const password = document.getElementById('password').value;

  if (password === 'DEIN_ADMIN_PASSWORT') {
    alert("Admin-Modus aktiviert!");
    document.getElementById('reset-table').style.display = 'block';  
    document.getElementById('add-person-container').style.display = 'block';
    document.getElementById('delete-person-container').style.display = 'block';
  } else {
    alert("Falsches Passwort!");
  }
});

// Person hinzufügen
document.getElementById('add-person').addEventListener('click', function() {
  const name = document.getElementById('name').value;
  const score = document.getElementById('score').value;

  if (name && score) {
    const personData = { name, score: parseInt(score) };

    fetch(`${supabaseUrl}/rest/v1/leaderboard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'apikey': apiToken
      },
      body: JSON.stringify(personData)
    })
    .then(response => response.json())
    .then(() => {
      alert("Person wurde hinzugefügt!");
      fetchLeaderboard();
    })
    .catch(error => console.error('Fehler beim Hinzufügen der Person:', error));
  } else {
    alert("Bitte füllen Sie alle Felder aus!");
  }
});

// Person löschen
function deletePerson(id) {
  fetch(`${supabaseUrl}/rest/v1/leaderboard?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'apikey': apiToken
    }
  })
  .then(() => {
    alert("Person wurde gelöscht!");
    fetchLeaderboard();
  })
  .catch(error => console.error('Fehler beim Löschen der Person:', error));
}

// Tabelle zurücksetzen
document.getElementById('reset-table').addEventListener('click', function() {
  fetch(`${supabaseUrl}/rest/v1/leaderboard`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      'apikey': apiToken
    }
  })
  .then(response => response.json())
  .then(() => {
    alert("Tabelle wurde zurückgesetzt!");
    fetchLeaderboard();
  })
  .catch(error => console.error('Fehler beim Zurücksetzen:', error));
});

// Tabelle beim Laden der Seite abrufen
window.onload = function() {
  fetchLeaderboard();
};

