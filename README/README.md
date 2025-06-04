<!-- Markdown cheatsheet für Details. Ansicht wie README auf GitHub aussieht. -->
# ☀️ SchmiärDi

Eine Web-App, die aktuelle UV-Daten an deinem Standort anzeigt und dabei hilft, den passenden Lichtschutzfaktor (SPF) für deinen Hauttyp und die geplante Sonnenzeit zu berechnen.

## Funktionen

- Anzeige des aktuellen UV-Index und einer UV-Prognose (6 Stunden)
- Interaktiver SPF-Rechner "Schmiär-O-Meter" basierend auf Hauttyp & Sonnenzeit
- SPF Empfehlung
- Responsives Design für Desktop & Mobile

## Installation

Diese App benötigt keine Installation. Du kannst sie einfach lokal oder online ausführen.

# Reflexion
 Ich habe mich dazu entschieden mein ursprüngliches UX-Design etwas anzupassen. Folgendes habe ich angepasst:

 - Die einzelnen Elemente in Boxen gepackt, sodass es geordneter aussieht.
 - Die Slider beim Hauttyp und Sonnenzeit durch Boxen ersetzt für eine bessere User Experience.

 Responsive:
 - Die wellenförmigen Linien weggelassen, da die Boxen für eine Unterteilung sorgen.
 - Das Fragezeichen für die Verlinkung zur Erklärseite durch die gleiche Verlinkung "Berächnig?" ersetzt und rechts oben angeordnet. Das Fragezeichen hat beim Testen an meinen Klassenkamerad:innen für Verwirrung gesorgt.

 ## Learnings
 - UX-Design ist ein dynamischer Prozess: Das ursprüngliche UX-Design kann sich im Verlauf der Webentwicklung verändern – besonders dann, wenn man noch wenig Erfahrung im Webdesign hat.
 - Reduziertes Design zahlt sich aus: Die ursprünglich in Figma entworfenen Slider für die Auswahl von Hauttyp und Sonnenzeit sahen zwar ansprechend aus, wären aber weniger benutzerfreundlich gewesen. Deshalb: simpel bleiben – die Entscheidung für einfache Auswahlboxen war sinnvoll.
 - Egal ob im css oder JavaScript, Beschriftungen im Code selber helfen enorm eine klare Übersicht zu behalten. Ebenfalls findet man bei einer guten Strukturierung Fehler schneller.
 
 ## Schwierigkeiten
 - Berechnungslogik für den SPF-Wert: Ich musste zunächst herausfinden, wie ich den „Schmiär-O-Meter“ technisch umsetzen kann. Mithilfe von Informationen des BAG zum UV-Index und der Hauttyp-Einteilung von MED konnte ich mit Unterstützung von ChatGPT eine passende Berechnungsformel in JavaScript entwickeln.
 - Responsive Design: Eine Herausforderung war es, die Anordnung der Elemente so zu gestalten, dass sie auf verschiedenen Bildschirmgrössen stimmig und funktional bleibt.

## Prompt Schmiär-O-Meter Chat GPT
- Wie kann ich die Formel "Empfohlene SPF = Geplante Sonnenzeit in Minuten / ((Eigenschutzzeit in Minutenumsetzen)x (8/UV-Index))" in JavaScript, sodass sie die vorhandenen Infos verwendet von der API und der eingegebenen Infos (Hauttyp, Sonnenzeit). Die Info findest du im beigefügten html und js file.
