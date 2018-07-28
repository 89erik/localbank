# localbank
localbank er en enkel web-applikasjon som holder styr på gjelden mellom 2 eller flere persjoner, til bruk eksempelvis i en husholdning med et felles matbudsjett. 
Applikasjonen er modellert som en bank med kontoer. Hver konto er knyttet til én person, og i tillegg er det én felleskonto. 
Eksempelvis kan utlegg til et fellesinnkjøp (matinnkjøp, betaling av regning, e.l) føres som en transaksjon fra 
en av kontoene til felleskontoen, eventuelt direkte til en annen person. Applikasjonen vil fortløpende beregne og vise frem gjelden som er et forslag på konkrete overføringer som fører til at alle går i skuls. Dette regnes ut ved å utføre alle de oppførte transaksjonene, deretter fordele innholdet på felleskonto jevnt over alle de andre kontoene, og til slutt plukke overføringer fra de positive til de negative saldoene. Det er også mulig å opprette flere banker. Man kan da ha én permanent bank til husholdningen, og så opprette andre banker ved behov for folk utenfor husholdningen, for eksempel ved ferieturer.

localbank er utviklet for å kjøre på en raspberry pi under apache vha. mod_wsgi. Back-end er utviklet i python 2.7 med Flask og mongoDB. Frontend er skrevet i javascript og bruker React og Redux.
