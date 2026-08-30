# Project TODO

- [x] Mobile Interface-Design mit Screen-Liste, Flows und Farbkonzept dokumentieren
- [x] Unified-Inbox mit kontoübergreifender Mail-Liste
- [x] Mail-Detailansicht mit Lesen, Favoriten-Umschalten und Antworten
- [x] Suche und Filter nach Konto und Status
- [x] Compose-Flow für neue Mails
- [x] Antwort- und Weiterleiten-Flow
- [x] Kontoübersicht mit Synchronisationsstatus
- [x] Konto-hinzufügen-Flow für Provider-Auswahl
- [x] Lokales Datenmodell und persistenter UI-Zustand mit AsyncStorage
- [x] iOS-orientiertes Branding, Icon und Theme
- [x] Tests für Mail-Filterung und Suche (Compose-Zustand folgt mit echter Versandlogik)
- [x] Qualitätsprüfung TypeScript und Datentests (manueller Gerätescan und Lint folgen)
- [ ] Reale OAuth-/IMAP-/SMTP-Anbindung als nächster Integrationsschritt nach Bereitstellung der Provider-Konfiguration

## Erweiterung: Ready-to-use und Flutter-Migration

- [ ] Provider-OAuth-Konfigurationen und sichere Secret-Verwaltung für Gmail/Microsoft 365
- [ ] Backend-Konto-Modell und verschlüsselte Token-Ablage
- [ ] Backend-Synchronisation für Nachrichten, Ordner, Labels und Lesestatus
- [ ] Reale Versand-API und Provider-spezifische Fehlerbehandlung
- [ ] Anhänge sicher hochladen, herunterladen und anzeigen
- [ ] Push-Benachrichtigungen und Hintergrund-Synchronisation
- [ ] Account-Verbindungsflow mit OAuth-Callback und IMAP/SMTP-Alternative
- [ ] Produktions-Umgebungsvariablen, Datenschutz- und Sicherheitsdokumentation
- [ ] Vollständige Testabdeckung für Provider-Adapter, Sync und Versand
- [ ] GitHub-ready README, CONTRIBUTING, LICENSE, .env.example und CI-Konfiguration
- [ ] Flutter/Dart-Migrationsplan mit API-Verträgen, Datenmodellen und Screen-Mapping
- [ ] GitHub-Repository verbinden und Code pushen, sobald Repository-URL und Schreibzugriff verfügbar sind

## Korrektur: Nutzerkonten statt Demo-Daten

- [x] Keine hardcodierten Konten im initialen App-Zustand
- [x] Keine Beispiel-Mails bei erstmaligem App-Start
- [x] Leerer Inbox-Zustand mit Konto-verbinden-Onboarding
- [x] Tests für Nutzer ohne verbundene Konten und leere Mail-Liste

## Sofort gestartet: echte Postfach-Verbindung

- [x] Gmail-OAuth-Login und Callback mit Nutzerkonto (Server-Flow implementiert)
- [x] Microsoft-365-OAuth-Login und Callback mit Nutzerkonto (Server-Flow implementiert)
- [x] Provider-Tokens verschlüsselt und nutzerbezogen speichern
- [ ] Echte Inbox-Synchronisation und normalisierte Maildaten
- [ ] Echten Versand über das ausgewählte Nutzerkonto implementieren
- [x] Konto-Verbindung ohne Provider-Credentials verständlich deaktivieren statt Demo-Daten zu zeigen

## Design-Refresh: gegen AI-Slop-Muster

- [x] Designsystem ohne Glows, Gradients, Glassmorphism und dekorative Hintergründe
- [x] Typografie mit klarer Größenhierarchie ohne Kicker, Serif-Hero oder künstliche Marketing-Copy
- [x] Inbox mit flacher, ruhiger Listenstruktur statt Kartenraster und verschachtelten Flächen
- [x] Empty States, Konten und Compose visuell konsistent überarbeitet; Detailansicht folgt im nächsten Pass
- [x] Tab-Bar und Interaktionen von dekorativen Akzenten und übertriebenen Animationen bereinigen
- [x] Visuelle Vorschau sowie TypeScript, Tests und Lint nach dem Refresh prüfen

## Fehler 1001: Erstes Postfach verbinden

- [x] Erstverbindung darf nicht an eine vorherige interne App-Anmeldung gebunden sein
- [x] Signierten Erstverbindungszustand mit sicherer lokaler Nutzeridentität implementieren
- [x] OAuth-Callback für Google und Outlook ohne unverständlichen Login-Fehler abschließen
- [ ] Mobile Rückkehr nach erfolgreicher Verbindung und Kontenaktualisierung herstellen
- [ ] Regressionstest für nicht angemeldeten Erststart und Fehler 1001 ergänzen

## Google-Redirect, Provider und Inbox-Empty-State

- [x] Google OAuth Redirect-URI auf eine registrierbare, stabile URL umstellen
- [x] Google-, Outlook-, iCloud- und andere-Anbieter-Status verständlich darstellen
- [x] iCloud-/generischen Anbieterfluss nicht als fälschlich fertige Verbindung anzeigen
- [x] Logo oben links in der Inbox sichtbar machen
- [x] Account-Button oben rechts mit Kontenansicht und Statusfunktion verbinden
- [x] Empty State zentral ausrichten und visuell ausarbeiten
- [x] Tests und Lint nach den Korrekturen geprüft; Preview-Server war beim Screenshot-Lauf nicht erreichbar

## GitHub-Repository und OAuth-Diagnose

- [ ] GitHub-Schreibzugriff und angemeldetes Konto prüfen
- [ ] GitHub-ready Dokumentation und `.env.example` erstellen, ohne Secrets zu committen
- [ ] Neues Repository mit passendem Namen anlegen
- [ ] Vollständigen aktuellen App-Code pushen
- [ ] Tatsächlich verwendete Google-Redirect-URI und Client-Konfiguration verifizieren
- [ ] Repository-Link und verbleibende Google-Cloud-Einstellung liefern

## Angegebenes GitHub-Ziel

- [x] Aktuellen lokalen Stand nach https://github.com/nmmhw4cbc7-commits/unified-mail-mobile pushen
- [x] Push auf dem Remote-Standardbranch verifizieren
