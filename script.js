// Supabase Initialisierung
const supabaseUrl = "https://gbegxojbypbgbmdzkgoz.supabase.co/";
const supabaseKey = "iI6eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZImdiZWd4b2pieXBiZ2JtZHprZ296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTQxMzUsImV4cCI6MjA0OTIzMDEzNX0.mhlDOTPMiRHjgnrKack9Qe1Fiu2FAVo0-iFU0HOKONA"; // Ersetze durch deinen API-Schlüssel
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Elemente aus dem DOM
const passwordForm = document.getElementById("passwordForm");
const addPlayerForm = document.getElementById("addPlayerForm");
const passwordInput = document.getElementById("password");
const playerNameInput = document.getElementById("playerName");
const playerScoreInput = document.getElementById("playerScore");
const leaderboard = document.getElementById("leaderboard").querySelector("tbody");

// Admin-Passwort
const password = "7D"; // Passwort für den Admin-Zugriff

// Funktion: Bestenliste laden
async function loadLeaderboard() {
  const { data, error } = await supabase.from("leaderboard").select("*").order("score", { ascending: false });
  if (error) {
    console.error("Fehler beim Laden der Bestenliste:", error.message);
    return;
  }

  leaderboard.innerHTML = ""; // Tabelle leeren
  data.forEach((player) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.score}</td>
      ${addPlayerForm.style.display === "block" ? `<td><button data-id="${player.id}" class="delete-btn">Löschen</button></td>` : ""}
    `;
    leaderboard.appendChild(row);
  });

  // Löschen-Buttons hinzufügen
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deletePlayer(id);
    });
  });
}

// Funktion: Spieler hinzufügen
addPlayerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = playerNameInput.value.trim();
  const score = parseInt(playerScoreInput.value, 10);

  if (name && !isNaN(score)) {
    const { error } = await supabase.from("leaderboard").insert([{ name, score }]);
    if (error) {
      console.error("Fehler beim Hinzufügen:", error.message);
    } else {
      playerNameInput.value = "";
      playerScoreInput.value = "";
      loadLeaderboard();
    }
  } else {
    alert("Bitte gültige Werte eingeben!");
  }
});

// Funktion: Spieler löschen
async function deletePlayer(id) {
  const { error } = await supabase.from("leaderboard").delete().eq("id", id);
  if (error) {
    console.error("Fehler beim Löschen:", error.message);
  } else {
    loadLeaderboard();
  }
}

// Funktion: Tabelle zurücksetzen
async function resetLeaderboard() {
  const { error } = await supabase.from("leaderboard").delete();
  if (error) {
    console.error("Fehler beim Zurücksetzen:", error.message);
  } else {
    loadLeaderboard();
  }
}

// Passwortprüfung und Admin-Bereich freigeben
passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (passwordInput.value === password) {
    addPlayerForm.style.display = "block"; // Admin-Funktion sichtbar machen

    // Reset-Button hinzufügen
    let resetButton = document.getElementById("resetLeaderboard");
    if (!resetButton) {
      resetButton = document.createElement("button");
      resetButton.id = "resetLeaderboard";
      resetButton.textContent = "Tabelle zurücksetzen";
      resetButton.style.marginTop = "20px";
      resetButton.addEventListener("click", resetLeaderboard);
      document.querySelector(".container").appendChild(resetButton);
    }

    loadLeaderboard(); // Tabelle mit Admin-Funktionen laden
    alert("Erfolgreich eingeloggt!");
  } else {
    alert("Falsches Passwort!");
  }
});

// Seite initialisieren
loadLeaderboard();


