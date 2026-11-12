// Server-only: spørsmål/fasit inngår ikke i webressursene eller offlinepakken.
export const networkQuestions=[];
function group(category,level,prompt,rows){const facts=rows.trim().split('\n').map(r=>r.split('|'));facts.forEach(([label,correct,note],i)=>{const others=[...new Set(facts.map(r=>r[1]))].filter(a=>a!==correct);networkQuestions.push({id:`net-${category}-${level}-${i}`,category,level,question:prompt(label),options:[correct,...others.slice(0,3)],correct:0,explanation:note||`${label[0].toUpperCase()+label.slice(1)}: ${correct}.`});});}
group('mix',0,x=>`Hvor mange ${x}?`,` 
sekunder er det i fem minutter|300
minutter er det i et kvarter|15
centimeter er det i to meter|200
milliliter er det i en halv liter|500
timer er det i to døgn|48`);
group('mix',1,x=>`Hvilket ord beskriver ${x}?`,`
et ord som skrives likt, men kan ha ulike betydninger|Homograf
en forkortelse dannet av forbokstaver som uttales som et ord|Akronym
bytting av bokstavrekkefølgen i et ord til et nytt ord|Anagram
et oppdiktet forfatternavn|Pseudonym
at flere ord i en frase begynner med samme lyd|Allitterasjon`);
group('mix',2,x=>`Hva er ${x}?`,`
summen av de første seks kvadrattallene fra 1²|91
antall forskjellige par som kan velges blant seks personer|15
antall positive divisorer til tallet 12|6
sannsynligheten for tre kron på tre rettferdige myntkast|1/8
neste tall i rekken 1, 1, 2, 3, 5, 8|13`);
group('world',0,x=>`Hva er hovedstaden i ${x}?`,`
Hellas|Athen
Portugal|Lisboa
Polen|Warszawa
Irland|Dublin
Østerrike|Wien`);
group('world',1,x=>`I hvilket land ligger ${x}?`,`
byen Dubrovnik|Kroatia
byen Kraków|Polen
byen Porto|Portugal
byen Salzburg|Østerrike
byen Brugge|Belgia`);
group('world',2,x=>`Hvilket hav eller havområde passer til «${x}»?`,`
havet øst for Vietnam og sør for Kina|Sør-Kina-havet
havet mellom Italia og Balkanhalvøya|Adriaterhavet
havet mellom Hellas og Tyrkias vestkyst|Egeerhavet
havområdet mellom India og Den arabiske halvøy|Arabiahavet
havet mellom Australia og New Zealand|Tasmanhavet`);
group('nature',0,x=>`Hvilket dyr ${x}?`,`
har svart og hvit stripet pels og ligner en hest|Sebra
har en stor manke hos voksne hanner og lever i flokker|Løve
har to pukler i den baktriske arten|Kamel
har et hardt skall og hører til krypdyrene|Skilpadde
er en bjørn med svart og hvit pels som spiser mye bambus|Kjempepanda`);
group('nature',1,x=>`Hvilket organ hos mennesker ${x}?`,`
pumper blod rundt i kroppen|Hjertet
filtrerer blod og produserer urin|Nyrene
produserer galle|Leveren
står for mesteparten av opptaket av næringsstoffer fra maten|Tynntarmen
står for gassutvekslingen mellom luft og blod|Lungene`);
group('nature',2,x=>`Hvilket begrep betyr ${x}?`,`
samliv der begge arter har nytte av samlivet|Mutualisme
samliv der én art har nytte mens den andre i hovedsak ikke påvirkes|Kommensalisme
samliv der én art utnytter en vert og skader den|Parasittisme
et rovdyrs fangst og fortæring av et byttedyr|Predasjon
kamp om begrensede ressurser mellom organismer|Konkurranse`);
group('culture',0,x=>`Hvilken filmfigur kjenner vi fra «${x}»?`,`
Lilo & Stitch|Stitch
Skjønnheten og udyret|Belle
Den lille havfruen|Ariel
Aladdin|Jasmin
Dumbo|Dumbo`);
group('culture',1,x=>`Hvilket nåværende land ligger fødestedet til komponisten ${x} i?`,`
Frédéric Chopin|Polen
Johann Sebastian Bach|Tyskland
Giacomo Puccini|Italia
Béla Bartók|Romania|Bartók ble født i Nagyszentmiklós i det daværende Ungarn, dagens Sânnicolau Mare i Romania.
Antonín Dvořák|Tsjekkia|Dvořák ble født i Böhmen, i det som i dag er Tsjekkia.`);
group('culture',2,x=>`Hvem regisserte «${x}»?`,`
Mulholland Drive (2001)|David Lynch
Den fabelaktige Amélie fra Montmartre (2001)|Jean-Pierre Jeunet
Lost in Translation (2003)|Sofia Coppola
Portrait de la jeune fille en feu (2019)|Céline Sciamma
The Piano (1993)|Jane Campion`);
group('sport',0,x=>`Hvilken idrett bruker betegnelsen «${x}»?`,`
straffespark fra elleve meter|Fotball
ippon og tatami|Judo
strike og spare|Bowling
scrum og lineout|Rugby
smash og sett på en bane med racket og en liten gul ball|Tennis`);
group('sport',1,x=>`Hvilket år ble ${x}?`,`
sommer-OL i Atlanta arrangert|1996
sommer-OL i Los Angeles i 1980-årene arrangert|1984
sommer-OL i München arrangert|1972
sommer-OL i Mexico by arrangert|1968
sommer-OL i Roma arrangert|1960`);
group('sport',2,x=>`Hvilket sjakkbegrep beskriver ${x}?`,`
at en brikke angriper to motstanderbrikker samtidig|Gaffel
at en brikke ikke kan flyttes uten å blottlegge kongen|Absolutt binding
at en truet verdifull brikke må flytte og blottlegger en brikke bak|Spidding
at en brikke flyttes og åpner angrep fra en annen brikke|Avdekkerangrep
at spilleren ville foretrukket å ikke ha trekket fordi lovlige trekk forverrer stillingen|Trekktvang`);
group('science',0,x=>`Hvilket materiale ${x}?`,`
brukes ofte som gjennomsiktig vindusrute|Glass
lages av trefibre og brukes i skrivebøker|Papir
er et rødlig metall som ofte brukes i elektriske ledninger|Kobber
er et lett metall som brukes i aluminiumsfolie|Aluminium
består av karbon og finnes i blyantstifter|Grafitt`);
group('science',1,x=>`Hvilket grunnstoff har kjemisk symbol ${x}?`,`
Ca|Kalsium
Mg|Magnesium
Al|Aluminium
Si|Silisium
Cl|Klor`);
group('science',2,x=>`Hvilket begrep beskriver ${x}?`,`
minimumsenergien som må til for å sette i gang en kjemisk reaksjon|Aktiveringsenergi
et stoff som øker reaksjonshastigheten uten å forbrukes totalt|Katalysator
en løsning som motvirker store pH-endringer ved små tilsetninger av syre eller base|Buffer
en syre-base-reaksjon der syre og base reagerer med hverandre|Nøytralisering
en reaksjon der oksidasjonstall endres gjennom elektronoverføring|Redoksreaksjon`);
