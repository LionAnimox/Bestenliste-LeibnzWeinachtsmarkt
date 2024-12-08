// Verbindung zu Supabase herstellen
const SUPABASE_URL = 'https://gbegxojbypbgbmdzkgoz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZWd4b2pieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let isAdmin = false;

// Bestenliste abrufen und aktualisieren
async function getLeaderboard() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false });

    if (error) {
        console.error('Fehler beim Abrufen der Bestenliste:', error);
        return;
    }

    const tbody = document.querySelector('#scoreboard tbody');
    tbody.innerHTML = '';

    data.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.points}</td>
        `;
        tbody.appendChild(row);
    });
}

// Passwortprüfung für Adminzugriff
function checkPassword() {
    const password = document.getElementById('adminPassword').value;

    if (password === '7D') {
        isAdmin = true;
        document.querySelector('.admin-functions').style.display = 'block';
        alert('Admin Zugang gewährt');
    } else {
        alert('Falsches Passwort');
    }
}

// Spieler hinzufügen
async function addPlayer() {
    const name = prompt('Name des Spielers:');
    const points = prompt('Punkte des Spielers:');

    if (name && points) {
        const { error } = await supabase
            .from('leaderboard')
            .insert([{ name, points: parseInt(points) }]);

        if (error) {
            alert('Fehler beim Hinzufügen des Spielers');
        } else {
            getLeaderboard();
        }
    }
}

// Spieler entfernen
async function removePlayer() {
    const name = prompt('Name des zu entfernenden Spielers:');

    if (name) {
        const { error } = await supabase
            .from('leaderboard')
            .delete()
            .match({ name });

        if (error) {
            alert('Fehler beim Entfernen des Spielers');
        } else {
            getLeaderboard();
        }
    }
}

// Bestenliste zurücksetzen
async function resetScores() {
    const { error } = await supabase
        .from('leaderboard')
        .delete();

    if (error) {
        alert('Fehler beim Zurücksetzen der Tabelle');
    } else {
        getLeaderboard();
    }
}

// Echtzeit-Updates aktivieren
supabase
    .from('leaderboard')
    .on('INSERT', payload => getLeaderboard())
    .on('DELETE', payload => getLeaderboard())
    .on('UPDATE', payload => getLeaderboard())
    .subscribe();

// Initialer Aufruf der Bestenliste
getLeaderboard();

