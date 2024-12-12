// Airtable API Details
const BASE_URL = "https://api.airtable.com/v0/appoBFFvxZZhXuJqx/Leaderboard";
const API_TOKEN = "patE0Ny5g5vcRyw25.89da40351909f1983873619b8871fbc09996a460178a71ce7be90fe42fa4922a";

// Admin Passwort
const ADMIN_PASSWORD = "7D";

// Funktionen zur Steuerung
let isAdmin = false;

async function fetchLeaderboard() {
    try {
        const response = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });
        const data = await response.json();
        updateLeaderboard(data.records);
    } catch (error) {
        console.error("Fehler beim Abrufen der Bestenliste:", error);
    }
}

function updateLeaderboard(records) {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = ""; // Alte Einträge entfernen

    // Sortieren und darstellen
    const sorted = records
        .map(record => ({
            id: record.id,
            name: record.fields.Name,
            score: record.fields.Punkte,
        }))
        .sort((a, b) => b.score - a.score);

    sorted.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        tbody.appendChild(row);
    });
}

function checkPassword() {
    const password = document.getElementById("admin-password").value;
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById("admin-controls").style.display = "block";
        alert("Admin-Funktionen aktiviert!");
    } else {
        alert("Falsches Passwort!");
    }
}

async function addPlayer() {
    if (!isAdmin) return alert("Admin-Rechte erforderlich!");

    const name = document.getElementById("player-name").value.trim();
    const score = parseInt(document.getElementById("player-score").value);

    if (!name || isNaN(score)) {
        return alert("Bitte gültige Werte eingeben.");
    }

    try {
        await fetch(BASE_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fields: { Name: name, Punkte: score },
            }),
        });
        fetchLeaderboard(); // Tabelle aktualisieren
        document.getElementById("player-name").value = "";
        document.getElementById("player-score").value = "";
    } catch (error) {
        console.error("Fehler beim Hinzufügen:", error);
    }
}

async function resetTable() {
    if (!isAdmin) return alert("Admin-Rechte erforderlich!");

    if (!confirm("Möchtest du die Tabelle wirklich zurücksetzen?")) return;

    try {
        const response = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const data = await response.json();

        for (const record of data.records) {
            await fetch(`${BASE_URL}/${record.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            });
        }
        fetchLeaderboard();
    } catch (error) {
        console.error("Fehler beim Zurücksetzen der Tabelle:", error);
    }
}

// Initiale Daten laden
fetchLeaderboard();
