
## UI-QA 31.08.2026

Die automatische mobile Preview-Prüfung für `/`, `/accounts`, `/settings` und `/compose` konnte nicht gerendert werden, weil der verwaltete Preview-Server aktuell keine Preview-URL liefert. Die Prüfung wird nach einem Neustart wiederholt. Der Code-Scan hat bereits interaktive Bereiche in Compose gefunden, die noch keine Aktion besitzen (Anhänge und Entwurf speichern); diese werden entweder implementiert oder bewusst als deaktiviert gekennzeichnet.

Die Google Cloud Console ist mit dem Entwicklerkonto geöffnet und zeigt den OAuth-Zustimmungsbildschirm in der Navigation. Ein automatischer Klick auf diesen Bereich löste jedoch einen Google-Console-JavaScript-Fehler („Maximum call stack size exceeded“) aus; es wurde keine Änderung an der Google-Konfiguration vorgenommen.
