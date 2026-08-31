
## Microsoft Entra verification

Am 30.08.2026 wurde das Azure-Portal mit `philippdachtler01@gmail.com` geöffnet. Im ausgewählten Standardverzeichnis `philippdachtler01gmail.onmicrosoft.com` zeigt App registrations: „This account isn't listed as an owner of any applications in this directory.“ Es sind keine eigenen App-Registrierungen sichtbar. Das erklärt `unauthorized_client: The client does not exist or is not enabled for consumers`: Die in der App hinterlegte Microsoft-Client-ID gehört nicht zu einer für dieses Konto beziehungsweise persönliche Consumer-Konten verfügbaren Registrierung.

Für Outlook.com-/Hotmail-/Live-Konten muss eine eigene Entra-App-Registrierung mit dem Kontotyp „Accounts in any organizational directory and personal Microsoft accounts“ erstellt oder die korrekte vorhandene Client-ID verwendet werden. Danach müssen Redirect-URI und Secret in der Projektumgebung aktualisiert werden.

## Microsoft-App-Registrierung gestartet

Das Azure-Formular zur Registrierung einer neuen App `Unified Mail` ist geöffnet. Der Name ist eingetragen. Noch nicht gespeichert sind der Kontotyp für persönliche Microsoft-Konten und die Web-Redirect-URI `https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback`.

## Azure registration state

Das Formular zur neuen App-Registrierung ist geöffnet und `Unified Mail` als Name eingetragen. Der erste Koordinatenklick auf den Kontotyp hat die Auswahl nicht übernommen; aktuell steht das Feld weiterhin auf „Single tenant only - Standardverzeichnis“. Die Auswahl „Any Entra ID Tenant + Personal Microsoft accounts“ muss noch ausdrücklich gesetzt werden, danach die Web-Redirect-URI und Registrierung speichern.

## Microsoft account type selected

Die Option `Any Entra ID Tenant + Personal Microsoft accounts` wurde im Azure-Registrierungsformular per sichtbarem Text ausgewählt. Die Auswahl und die anschließende Registrierung müssen noch im Formular verifiziert werden.

## Azure selection issue

Die Azure-Oberfläche zeigt die gewünschte Option an, übernimmt sie im aktuellen Formular aber nach mehreren gezielten Auswahlversuchen nicht; das Feld bleibt auf „Single tenant only - Standardverzeichnis“. Es wurde deshalb noch keine falsche App registriert. Für eine funktionierende persönliche Outlook-Anbindung muss die Auswahl sichtbar auf `Any Entra ID Tenant + Personal Microsoft accounts` stehen, bevor die App registriert wird.

## Azure platform selection

Das Formular zeigt nun korrekt `Any Entra ID Tenant + Personal Microsoft accounts`. Die Plattform-Auswahl ist geöffnet und bietet `Public client/native`, `Web` und `Single-page application (SPA)` an. Für den serverseitigen OAuth-Callback wird `Web` benötigt; anschließend ist die produktive Redirect-URI einzutragen.

## Azure web platform pending

Der Kontotyp `Any Entra ID Tenant + Personal Microsoft accounts` ist bestätigt. Die Plattform-Auswahl ist weiterhin geöffnet; `Web` wurde per DOM-Aktion angesteuert, ist im Formular aber noch nicht als ausgewählter Wert sichtbar. Die Redirect-URI wurde daher noch nicht eingetragen und die App noch nicht registriert.

## Azure web option action

Die gerenderte Option `Web` besteht aus einem verschachtelten SVG-Span; ein direkter Textklick reichte nicht. Die Auswahlaktion wurde deshalb auf das anklickbare Elternelement ausgeweitet. Der tatsächliche Formularwert muss noch per Ansicht bestätigt werden.

## Azure verification after selection

Der Kontotyp `Any Entra ID Tenant + Personal Microsoft accounts` ist im Formular sichtbar und damit korrekt übernommen. Die Plattform-Auswahl bleibt jedoch geöffnet; der Wert steht noch auf `Select a platform`. Die Web-Redirect-URI kann erst nach Auswahl von `Web` eingetragen werden.

## Azure platform still pending

Der Kontotyp `Any Entra ID Tenant + Personal Microsoft accounts` bleibt korrekt gesetzt. Die Plattform-Auswahl zeigt weiterhin `Public client/native`, `Web` und `Single-page application (SPA)`; der sichtbare Formularwert ist noch `Select a platform`. Es wurde noch keine Microsoft-App registriert.

## Azure DOM selection detail

Die Plattformoption `Web` wird als `div[role="treeitem"]` mit `aria-posinset="2"` und der ID `form-label-id-32aria1` gerendert. Der Auswahlwert bleibt aktuell `Select a platform`; die Option kann gezielt über dieses Treeitem aktiviert werden.

## Azure selection remains blocked

Die Auswahl des Kontotyps bleibt korrekt. Trotz DOM- und Tastaturversuchen bleibt das Plattformfeld auf `Select a platform`; das Menü bleibt sichtbar. Es wurde keine Microsoft-App registriert und keine neue Client-ID erzeugt.

## Azure UI limitation

Bei der Auswahl der Plattform `Web` schließt Azure das Menü, setzt den Formularwert jedoch nicht. Kontotyp und App-Name bleiben korrekt; wegen der nicht gesetzten Plattform und fehlenden Redirect-URI wurde keine App-Registrierung abgeschickt.

## Azure virtual dropdown diagnostic

Die Auswahlkomponente ist eine Knockout-gebundene virtuelle Liste. Die Web-Option wird als `role=treeitem` gerendert, aber synthetische DOM-Klicks und Tastaturereignisse ändern den Formularwert nicht. Der Kontotyp ist korrekt; die App-Registrierung wurde weiterhin nicht abgeschickt, um keine falsche Microsoft-Client-ID zu erzeugen.

## Azure registration form ready

Das Azure-Registrierungsformular ist jetzt vollständig vorbereitet:

- Name: `Unified Mail`
- Kontotyp: `Any Entra ID Tenant + Personal Microsoft accounts`
- Plattform: `Web`
- Redirect URI: `https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback`

Die Registrierung wurde erfolgreich abgeschickt. Die öffentliche Application (client) ID lautet `94f1c171-f990-4a06-9f21-ee42435889e2`. Die Object ID lautet `00ac9b6b-4a6c-47ea-9d62-c27f4f41b97d`, die Directory (tenant) ID `30367898-3886-42a5-80db-eb9331ecd287`. Azure zeigt den Status `Activated`, den Kontotyp `All Microsoft account users` und `1 web` Redirect URI. Die Client-ID ist kein Secret; ein Client Secret muss noch erstellt werden und darf nicht in Git committen.

## Aktueller Teststatus 31.08.2026

Outlook/Microsoft 365 wurde über die neue Entra-App erfolgreich verbunden und erscheint in der Kontenansicht. Die Inbox verwendet nun ebenfalls die serverseitig geladenen Konten und zeigt bei einem verbundenen, aber noch nicht synchronisierten Konto nicht mehr den Zustand „Kein Postfach verbunden“, sondern eine leere Nachrichtenliste.

Die Google-Anmeldung erreicht den Google-Login, wird danach aber mit HTTP 403 und dem Hinweis abgelehnt, dass die Überprüfung von `manus.space` noch nicht abgeschlossen ist. Das ist eine Google-Cloud-Consent-Screen- bzw. Publishing-Einstellung und kein Redirect-URI-Fehler. Für Tests muss die Google-OAuth-App entweder veröffentlicht werden oder das verwendete Google-Konto im Bereich „Test users“ des OAuth consent screen eingetragen werden. Die produktive Redirect-URI bleibt `https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback`.

Die eigentliche Provider-Inbox-Synchronisation (Gmail API und Microsoft Graph) ist noch nicht implementiert; die Verbindung speichert aktuell bereits die verschlüsselten Tokens und zeigt das Konto korrekt an, lädt aber noch keine Nachrichten in den mobilen Store.
