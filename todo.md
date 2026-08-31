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

- [x] Provider-OAuth-Konfigurationen und sichere Secret-Verwaltung für Gmail/Microsoft 365
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
- [x] Mobile Rückkehr nach erfolgreicher Verbindung und Kontenaktualisierung herstellen
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

## Prompt-Ausführung: Build, OAuth und Erststart

- [x] Produktions-Build lokal reproduzieren und Vercel-Serverless-Struktur ergänzen
- [x] Tatsächlich verwendete Google-Redirect-URI und Client-Konfiguration konsolidieren
- [x] Keine drei hardcodierten Konten in Inbox, Kontenansicht oder Store
- [x] Keine Beispielnachrichten im Erststart inklusive AsyncStorage-Migration
- [x] Inbox-Logo links, Account-Aktion rechts und zentraler Empty State verifizieren
- [x] Alle Prüfungen ausführen und geprüften Stand nach GitHub pushen

## Konkrete OAuth-Fehler

- [ ] Google `redirect_uri_mismatch` mit der tatsächlich verwendeten URI beheben
- [x] Microsoft `unauthorized_client` durch korrekte Client-ID und unterstützten Kontotyp beheben
- [x] Provider-Fehler im Callback mit verständlichen nächsten Schritten anzeigen
- [x] OAuth-Start-URLs und Token-Exchange-URLs automatisiert testen
- [ ] Geprüften OAuth-Fix nach GitHub pushen

## Nächster Integrationsschritt: echte Nachrichten-Synchronisation

- [x] Provider-Token sicher entschlüsseln und bei Bedarf per Refresh-Token erneuern
- [x] Gmail-Posteingang über Gmail API abrufen und in ein gemeinsames Mailmodell normalisieren
- [x] Microsoft-Posteingang über Microsoft Graph abrufen und in dasselbe gemeinsame Mailmodell normalisieren
- [x] Synchronisierte Nachrichten serverseitig speichern und dem mobilen Inbox-Flow bereitstellen
- [ ] Sync-Fehler, abgelaufene Berechtigungen und leere Konten verständlich behandeln

## Verbindungsproblem nach Microsoft-Anmeldung

- [x] Microsoft-Callback-Fehler in eine konkrete, nutzerlesbare Meldung übersetzen
- [x] Nach erfolgreicher Verbindung eine sichere Rückkehr in die App und Kontenaktualisierung herstellen
- [x] Abgebrochene oder fehlgeschlagene Microsoft-Anmeldung ohne hängenbleibenden Zustand behandeln
- [x] Outlook-Verbindungsflow ohne echte Zugangsdaten automatisiert regressionsprüfen

## Aktueller Verbindungs- und Inbox-Fehler

- [x] Verbundenes Outlook-Konto als echte Inbox-Quelle statt statischer leerer Kontenliste verwenden
- [x] Nach erfolgreicher OAuth-Verbindung Konten und Inbox automatisch neu laden
- [x] Google-403-Status für nicht abgeschlossene OAuth-Verifizierung verständlich behandeln und dokumentieren
- [ ] Alle geprüften Änderungen in den bestehenden GitHub-main-Branch pushen

## Ready-to-use-Ausbau

- [x] Nachrichten-Tabelle mit Provider-ID, Konto-ID, Thread, Absendern, Inhalt, Labels, Anhängen und Zeitstempeln ergänzen
- [x] Zugriffstoken serverseitig entschlüsseln und abgelaufene Tokens sicher erneuern
- [x] Gmail-Posteingang abrufen, normalisieren, deduplizieren und speichern
- [x] Microsoft-Posteingang über Microsoft Graph abrufen, normalisieren, deduplizieren und speichern
- [x] Mobile Inbox aus synchronisierten Nachrichten und dynamischen Konten aufbauen
- [ ] Nachrichten lesen, als gelesen markieren und Favoriten serverseitig synchronisieren
- [x] Gmail- und Microsoft-Versand mit Reply/Forward-Unterstützung implementieren
- [ ] Provider- und Netzwerkfehler mit Retry, Reconnect-Hinweis und verständlicher UI behandeln
- [ ] Anhänge sicher verarbeiten und Größen-/Typgrenzen dokumentieren
- [x] Automatisierte Tests für Provider-Adapter, Sync, Versand und OAuth-Fehler ergänzen
- [ ] Datenschutz-, Sicherheits-, Betriebs- und Flutter-Migrationsdokumentation vervollständigen

## Kritische Stabilisierung: Google, Versand und UI

- [x] Google-OAuth-Consent-Screen und Testnutzer-/Publishing-Konfiguration für den tatsächlichen Login prüfen
- [x] Versandantworten, Provider-Message-ID und Fehlerstatus dauerhaft protokollieren, damit Zustellung nachvollziehbar ist
- [x] Versand für Gmail und Outlook mit korrekten Provider-Anforderungen und Selbsttest-Feedback reparieren
- [ ] Alle sichtbaren Pressables auf echte Aktionen, Navigation oder bewusste Deaktivierung prüfen
- [ ] Mobile Screens auf einheitliche Safe-Area-, Abstands-, Größen- und Tab-Bar-Regeln umstellen
- [ ] Preview auf Desktop und schmalem Mobil-Viewport visuell prüfen und Regressionstests ergänzen

## Sofortige Stabilisierung: Google, Buttons, Versand und Layout

- [x] Google-OAuth-Branding, Zielgruppe und Testnutzer vollständig konfigurieren
- [ ] Alle sichtbaren Aktionen auf echte Navigation, funktionale Mutation oder bewusst deaktivierten Zustand prüfen
- [x] Versandstatus und Provider-Antwort für Gmail/Outlook verständlich anzeigen
- [ ] Layoutprobleme auf den Kernscreens mit einheitlichen Safe-Area- und Abstandsregeln beheben
- [ ] Kernflows auf Web und mobilem Portrait-Viewport regressionsprüfen
