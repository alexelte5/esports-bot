🗺️ Die E-Sports Bot Architektur-Roadmap
1. Die Konfiguration (.env)

Lege hier drei Schlüssel ab:

    Einen für den Token von PandaScore.

    Einen für den Token von deinem Discord-Bot.

    Einen für die Ziel-Channel-ID, in die der Bot posten soll.

2. Das API-Modul (src/api/pandascore.ts)

Deine Aufgabe hier ist es, die Kommunikation mit dem PandaScore-Server aufzubauen.
Das Interface (Der Typ)

Bevor du den Request absetzt, überlege dir, welche Daten du im JSON suchst. Baue ein TypeScript-Interface für ein Match. Du brauchst mindestens:

    Eine eindeutige ID (number) zur Identifizierung.

    Den Status des Matches (es soll ja finished sein).

    Den Namen der Liga (um später nach LEC, LCK zu filtern).

    Die Namen der beiden Teams.

    Die Scores der beiden Teams.

Die Funktion

Schreibe eine asynchrone Funktion (z. B. fetchPastMatches), die:

    Den PandaScore-Token aus den Umgebungsvariablen (process.env) zieht.

    Einen fetch-Aufruf an den Endpoint [https://api.pandascore.co/lol/matches](https://api.pandascore.co/lol/matches) abfeuert.

    Wichtig: Nutze URL-Parameter (Query-Params), um die Datenmenge zu begrenzen! Filter direkt in der URL nach filter[status]=finished und setze ein Limit (z. B. per_page=5), um deinen Free-Tier-Traffic zu schonen.

    Vergiss nicht den Authorization-Header mit deinem Token!

    Caste das Ergebnis am Ende mit as Match[] und gib es zurück.

3. Das Gedächtnis (src/data/stateManager.ts)

Dieses Modul verhindert den Benachrichtigungs-Spam. Du brauchst eine Klasse (z. B. StateManager), die eine Liste von IDs verwaltet.
Die Logik

    Im Konstruktor: Prüfe mit Node.js-Dateisystem-Funktionen (fs.existsSync), ob im Ordner ../data/ bereits eine sent_matches.json liegt.

        Wenn ja: Lies sie ein (fs.readFileSync), parse das JSON und lade die IDs in ein internes Set<number>.

        Wenn nein: Erstelle den Ordner und eine leere JSON-Datei ([]).

    Methode 1 (hasBeenSent): Eine Funktion, die eine id entgegennimmt und prüft, ob sie bereits im Set existiert (set.has(id)). Gibt true oder false zurück.

    Methode 2 (saveMatchId): Eine Funktion, die eine neue id in das Set einfügt (set.add(id)). Direkt danach konvertierst du das Set wieder in ein Array, machst ein JSON.stringify() daraus und schreibst es zurück in die Datei (fs.writeFileSync).

4. Das Bot-Modul (src/bot/discord.ts)

Hier steuerst du den Discord-Client über das Paket discord.js.
Die Logik

    Instanziiere den Client und übergib die passenden Intents (mindestens GatewayIntentBits.Guilds).

    Schreibe eine init-Funktion, die den client.login(TOKEN) ausführt. Nutze client.once('ready', ...) um auf der Konsole auszugeben, dass der Bot online ist.

    Schreibe eine Funktion zum Senden (z. B. sendEmbed). Diese nimmt dein Match-Objekt entgegen.

    In der Funktion: Hole den Channel über client.channels.cache.get(CHANNEL_ID).

    Baue mit dem EmbedBuilder von Discord eine schicke Nachricht. Setze eine Farbe, den Titel (z. B. den Liga-Namen) und die Namen der Teams inklusive des Scores.

    Sende das Embed ab: channel.send({ embeds: [embed] }).

5. Das Gehirn (src/index.ts)

Hier läuft alles zusammen.
Der Ablauf

    Initialisiere als allererstes dotenv, damit process.env befüllt wird.

    Instanziiere deinen StateManager und starte den Discord-Bot.

    Baue eine zentrale, asynchrone Loop-Funktion (z. B. tick):

        Rufe die Matches aus deinem API-Modul ab.

        Loope durch die Matches.

        Filter-Logik: Prüfe für jedes Match: Ist der Liga-Name "LEC", "LCK" oder "LPL"? Und: Sagt der StateManager, dass diese Match-ID noch nicht gesendet wurde?

        Wenn beides passt: Übergib das Match an dein Discord-Modul zum Senden und sage dem StateManager, dass er sich die ID jetzt merken soll.

    Führe diese tick-Funktion einmal sofort beim Start aus.

    Nutze setInterval(tick, 5 * 60 * 1000), um die Funktion alle 5 Minuten im Hintergrund laufen zu lassen.