// Verbindung zu Supabase herstellen
const SUPABASE_URL = 'https://gbegxojbypbgbmdzkgoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZWd4b2pieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tabelle initial aktualisieren
async function updateTable() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false }); // Sortiert nach Punkten

    if (error) {
        console.error('Fehler beim Abrufen der Tabelle:', error);
        return;
    }

    const tableBody = document.querySelector('#personTable tbody');
    tableBody.innerHTML = ''; // Alte Daten löschen

    data.forEach((person) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.points}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Neue Person hinzufügen
async function addPerson(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const name = document.getElementById('name').value;
    const points = parseInt(document.getElementById('points').value);

    if (!name || isNaN(points)) {
        alert('Bitte Name und Punkte eingeben.');
        return;
    }

    const { data, error } = await supabase
        .from('leaderboard')
        .insert([{ name, points }]);

    if (error) {
        alert('Fehler beim Hinzufügen der Person.');
        console.error(error);
    } else {
        console.log('Person erfolgreich hinzugefügt:', data);
        document.getElementById('addPersonForm').reset(); // Formular zurücksetzen
        await updateTable(); // Tabelle aktualisieren
    }
}

// Event Listener für das Formular
document.getElementById('addPersonForm').addEventListener('submit', addPerson);

// Tabelle bei Seitenaufruf laden
updateTable();

