# Google OAuth verification

Am 30.08.2026 wurde im Google-Cloud-Projekt `Unified Email App` der aktive OAuth-Webclient `13090430164-vju8hipoh1s3gglef871stgkc5dsjonr.apps.googleusercontent.com` geprüft. Vorher war als autorisierte Redirect-URI nur `http://localhost:3000/api/auth/callback/google` eingetragen. Die produktive Unified-Mail-Callback-URI wurde ergänzt und in der Google Cloud Console erfolgreich gespeichert:

`https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback`

Der Anwendungscode verwendet dieselbe URI beim OAuth-Start und beim Token-Code-Tausch. Eine erneute Anmeldung sollte erst nach der üblichen Google-Konfigurationsverzögerung getestet werden.

Die Microsoft-Meldung `unauthorized_client` weist weiterhin auf eine Azure-App-Registrierung hin, die persönliche Consumer-Konten nicht unterstützt oder eine falsche Client-ID verwendet. Das lässt sich nicht allein durch eine Codeänderung freischalten; in Entra muss der unterstützte Kontotyp zur gewünschten Outlook-Nutzung passen.

## Nachtest

Die Redirect-URI wurde in Google Auth Platform erfolgreich gespeichert. Beim Aufruf von `https://unimailapp-aje7zwqe.manus.space` zeigte die produktive Domain am 30.08.2026 jedoch „This site is under maintenance“. Deshalb konnte der vollständige OAuth-End-to-End-Test nach der Änderung noch nicht ausgeführt werden.
