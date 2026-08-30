# Provider-Research für Unified Mail

## Google

Die offiziellen Google-Dokumente beschreiben OAuth 2.0 als erforderlichen Autorisierungsweg für private API-Daten. Für die App müssen passende OAuth-Client-Credentials erstellt, Scopes explizit angefordert und Refresh-Tokens sicher langfristig gespeichert werden. Google empfiehlt OAuth-Bibliotheken und inkrementelle Scope-Anforderung. Quelle: https://developers.google.com/identity/protocols/oauth2

## Microsoft 365 / Outlook

Microsoft Graph unterstützt den Zugriff auf primäre und gemeinsame Cloud-Postfächer. Mails liegen in `mailFolder`-Ressourcen; die API unterstützt Lesen, Ordner und Versand. Message- und Folder-IDs dürfen nicht als dauerhaft unveränderlich behandelt werden; für Synchronisation sind Delta-Abfragen und gegebenenfalls immutable IDs zu berücksichtigen. Quelle: https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview?view=graph-rest-1.0

## Architekturentscheidung

Die App verwendet einen Provider-Adapter pro Dienst, ein normalisiertes internes Mail-Modell und eine serverseitige Token-Ablage. Ohne konkrete OAuth-Client-Konfigurationen beziehungsweise IMAP/SMTP-Serverdaten kann die reale Verbindung nicht aktiviert werden; die lokale App-Demo bleibt als deterministischer Fallback erhalten.
