# Unified Mail – Mobiles Interface-Design

## Produktidee

Unified Mail bündelt mehrere private und geschäftliche Postfächer in einer ruhigen, schnellen Inbox. Die Oberfläche orientiert sich an iOS-Mail- und Messaging-Konventionen: klare Hierarchie, große tappbare Ziele, zurückhaltende Farben, sichtbarer Kontokontext und ein prominenter Verfassen-Button.

## Screen-Liste

| Screen | Primärer Inhalt und Funktion |
|---|---|
| Unified Inbox | Kontoübergreifende Mail-Liste, Suchfeld, Filterchips, ungelesene Zähler, Kontofilter und Verfassen-Aktion |
| Mail-Detail | Absender, Empfänger, Betreff, Zeit, Konto-Badge, Mailtext, Anhänge sowie Antworten-/Weiterleiten-Aktionen |
| Compose | Absenderkonto, Empfänger, CC/BCC, Betreff, Nachrichtentext, Entwurf speichern und Senden |
| Accounts | Verbundene Postfächer, Synchronisationsstatus, Standard-Absender und Konto hinzufügen |
| Add Account | Auswahl von Gmail, Outlook/Microsoft 365, iCloud und generischem IMAP/SMTP; anschließend sicherer Verbindungsflow |
| Search | Suchergebnisse über Absender, Betreff und Mailtext, mit Konto- und Statusfiltern |
| Settings | Benachrichtigungen, Darstellung, Datenschutz, Synchronisationsintervall und Hilfe |

## Navigation

Die Tab-Bar enthält **Posteingang**, **Konten** und **Einstellungen**. Mail-Detail, Suche, Compose und Add Account werden als Stack-Screens geöffnet. Der Verfassen-Button sitzt im Inbox-Header beziehungsweise als Floating Action Button im unteren rechten Bereich, bleibt aber oberhalb der Tab-Bar und ist mit einer Hand erreichbar.

## Haupt-Flows

1. **Mail lesen:** Nutzer öffnet Posteingang → tippt eine Mail → Mail-Detail erscheint → Zurück führt zur vorherigen Filteransicht.
2. **Mail suchen:** Nutzer tippt in die Suche → schreibt mindestens ein Zeichen → Ergebnisse werden live nach Relevanz und Aktualität gefiltert → Konto-Chip grenzt die Suche optional ein.
3. **Antworten:** Nutzer öffnet Mail-Detail → tippt Antworten → Compose öffnet mit vorausgefülltem Empfänger und Betreff → Senden zeigt eine Bestätigung und kehrt zur Mail zurück.
4. **Neue Mail:** Nutzer tippt Verfassen → wählt bei Bedarf das Absenderkonto → ergänzt Empfänger, Betreff und Text → Senden zeigt einen Ladezustand und eine Erfolgsmeldung.
5. **Konto hinzufügen:** Nutzer öffnet Konten → tippt Konto hinzufügen → wählt Anbieter → durchläuft OAuth- oder IMAP-Eingabe → sieht den neuen Synchronisationsstatus in der Kontenliste.

## Visuelle Richtung

Die Marke nutzt ein warmes Off-White als Hintergrund, tiefes Navy für Primärtext und ein elektrisches Kobaltblau als Akzent. Konto-Badges verwenden differenzierte, aber gedämpfte Farben: Gmail-Rot, Outlook-Blau, iCloud-Violett und IMAP-Türkis. Karten haben weiche 16-Punkt-Radien, feine Konturen und keine schweren Schatten. Ungelesene Mails werden über Gewicht und einen kleinen farbigen Punkt statt über große farbige Flächen hervorgehoben.

| Design-Token | Wert | Verwendung |
|---|---|---|
| Ink Navy | `#122033` | Primärtext und Logo |
| Cobalt | `#356AE6` | Aktionen, aktive Navigation, Links |
| Canvas | `#F7F8FC` | Haupthintergrund |
| Surface | `#FFFFFF` | Karten und Eingabeflächen |
| Mist | `#E8ECF4` | Trennlinien und sekundäre Flächen |
| Muted | `#718096` | Metadaten und Platzhalter |
| Success | `#2FA36B` | Synchronisation und Versandbestätigung |
| Warning | `#D9912A` | Verbindungswarnungen |

## Accessibility und Einhandbedienung

Alle interaktiven Flächen erhalten mindestens etwa 44 Punkte Höhe. Sekundärinformationen werden nicht ausschließlich über Farbe vermittelt. Textgrößen, Zeilenhöhen und Kontrast bleiben auch bei längeren Betreffzeilen lesbar. Die wichtigsten Aktionen liegen im unteren oder mittleren Bildschirmbereich; destructive Aktionen werden nicht als primäre Geste verwendet.
