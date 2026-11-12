// Egenformulerte spørsmål. Hver faktagruppe gir ti spørsmål med relevante svaralternativer.
export const levelNames=['Nybegynner','Viderekommen','Ekspert'];
export const categories=[
 {id:'mix',name:'Litt av alt',icon:'🎉',color:'#eee4fa',description:'En herlig blanding for nysgjerrige hoder.'},
 {id:'world',name:'Verden rundt',icon:'🌍',color:'#dceee9',description:'Ta en liten reise. Oppdag noe stort.'},
 {id:'nature',name:'Dyr og natur',icon:'🦊',color:'#e6edcc',description:'Ville fakta fra en fantastisk planet.'},
 {id:'culture',name:'Film og musikk',icon:'🍿',color:'#f9e0e8',description:'Fra filmlerretet til spillelisten din.'},
 {id:'sport',name:'Sport og spill',icon:'🏆',color:'#f9e6ca',description:'Spill deg varm på regler og rekorder.'},
 {id:'science',name:'Vitenskap og teknologi',icon:'🚀',color:'#e0e9fa',description:'Små spørsmål om store oppdagelser.'}
];
export const bank=[];
function group(category,level,key,prompt,rows,explain){
 const facts=rows.trim().split('\n').map(line=>line.split('|'));
 facts.forEach(([label,correct,note],i)=>{
  const others=[...new Set(facts.filter((_,j)=>j!==i).map(r=>r[1]))].filter(a=>a!==correct);
  if(others.length<3)throw Error('For få ulike svar: '+key);
  const options=[correct,...others.slice(i%Math.max(1,others.length-2),i%Math.max(1,others.length-2)+3)];
  bank.push({id:`${category}-${level}-${key}-${i+1}`,category,level,question:prompt(label),options,correct:0,explanation:note||explain(label,correct)});
 });
}
// LITT AV ALT
 group('mix',0,'hverdag',x=>`Hva bruker vi for å ${x}?`,`
måle temperatur|Termometer
finne retningen mot nord|Kompass
måle tid på en løpetur|Stoppeklokke
veie ingredienser|Kjøkkenvekt
se svært små detaljer|Mikroskop
se på stjerner langt unna|Teleskop
måle lengden på et bord|Målebånd
måle lufttrykk|Barometer
måle elektrisk spenning|Voltmeter
måle vinkler på et ark|Gradskive`,(x,a)=>`${a} brukes for å ${x}.`);
 group('mix',0,'mat',x=>`Hva er hovedingrediensen i ${x}?`,`
guacamole|Avokado
hummus|Kikerter
tradisjonell havregrøt|Havregryn
potetmos|Poteter
omelett|Egg
marengs|Eggehvite og sukker
tradisjonell risgrøt|Ris
popcorn|Mais
tradisjonell eplemos|Epler
tofu|Soyabønner`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} lages hovedsakelig av ${a.toLowerCase()}.`);
 group('mix',0,'sprak',x=>`Hva er det motsatte av «${x}»?`,`
varm|Kald
høy|Lav
lang|Kort
bred|Smal
tung|Lett
rask|Langsom
tidlig|Sen
våt|Tørr
lys|Mørk
full|Tom`,(x,a)=>`«${a}» er et antonym, altså et ord med motsatt betydning av «${x}».`);
 group('mix',1,'forfatter',x=>`Hvem skrev «${x}»?`,`
Pippi Langstrømpe|Astrid Lindgren
Småtrollene og den store oversvømmelsen|Tove Jansson
Charlie og sjokoladefabrikken|Roald Dahl
Folk og røvere i Kardemomme by|Thorbjørn Egner
Mio, min Mio|Astrid Lindgren
Alice i Eventyrland|Lewis Carroll
Hobbiten|J.R.R. Tolkien
Den lille prinsen|Antoine de Saint-Exupéry
Robinson Crusoe|Daniel Defoe
Skatten på sjørøverøya|Robert Louis Stevenson`,(x,a)=>`«${x}» er skrevet av ${a}.`);
 group('mix',1,'historie',x=>`Hvilket år ${x}?`,`
fikk Norge sin grunnlov|1814
ble unionen mellom Norge og Sverige oppløst|1905
begynte første verdenskrig|1914
sluttet andre verdenskrig i Europa|1945
falt Berlinmuren|1989
landet de første menneskene på månen|1969
begynte den franske revolusjonen|1789
ble Harald Hardråde drept ved Stamford Bridge|1066
ble FN grunnlagt|1945
ble den amerikanske uavhengighetserklæringen vedtatt|1776`,(x,a)=>`Hendelsen fant sted i ${a}.`);
 group('mix',1,'begrep',x=>`Hva kalles ${x}?`,`
et ord som leses likt begge veier|Palindrom
et ord som betyr omtrent det samme som et annet|Synonym
et ord som betyr det motsatte av et annet|Antonym
et ord som imiterer en lyd|Lydord
en fortelling om en persons liv skrevet av personen selv|Selvbiografi
en oversikt over bøker og kilder|Bibliografi
læren om ords opprinnelse|Etymologi
en samling kart utgitt som en bok|Atlas
en alfabetisk oversikt over emner med sidehenvisninger bakerst i en bok|Register
en ordliste med forklaringer på faguttrykk|Glossar`,(x,a)=>`Begrepet er ${a.toLowerCase()}: ${x}.`);
 group('mix',2,'geometri',x=>`Hvor mange ${x}?`,`
kanter har en kube|12
flater har et tetraeder|4
flater har et oktaeder|8
flater har et dodekaeder|12
flater har et ikosaeder|20
diagonaler har en femkant|5
diagonaler har en sekskant|9
grader er vinkelsummen i en femkant|540
grader er vinkelsummen i en sekskant|720
grader er hver innvendige vinkel i en regulær åttekant|135`,(x,a)=>`Svaret er ${a}. For en n-kant er vinkelsummen (n − 2) × 180°, og antall diagonaler er n × (n − 3) / 2.`);
 group('mix',2,'kulturhistorie',x=>`Hvem er kjent for ${x}?`,`
maleriet «Skrik»|Edvard Munch
maleriet «Mona Lisa»|Leonardo da Vinci
maleriet «Stjernenatt» fra 1889|Vincent van Gogh
maleriet «Guernica»|Pablo Picasso
skulpturen «Tenkeren»|Auguste Rodin
taket i Det sixtinske kapell|Michelangelo
maleriet «Pike med perleøredobb»|Johannes Vermeer
maleriet «Venus' fødsel»|Sandro Botticelli
maleriet «Las Meninas»|Diego Velázquez
maleriet «Nattevakten»|Rembrandt`,(x,a)=>`${a} skapte ${x}.`);
 group('mix',2,'logikk',x=>`Hva er ${x}?`,`
12,5 % av 240|30
summen av primtallene under 10|17
minste felles multiplum av 6 og 8|24
største felles divisor for 48 og 18|6
antall mulige rekkefølger av fire ulike bøker|24
antall håndtrykk når fem personer hilser én gang på alle de andre|10
sannsynligheten for to seksere på to vanlige terningkast|1/36
neste tall i rekken 2, 6, 12, 20, 30|42
summen av de første ti positive heltallene|55
medianen av tallene 3, 7, 8, 12 og 20|8`,(x,a)=>`Svaret er ${a}.`);
// VERDEN RUNDT
 group('world',0,'europa',x=>`Hva er hovedstaden i ${x}?`,`
Norge|Oslo
Sverige|Stockholm
Danmark|København
Finland|Helsingfors
Island|Reykjavík
Frankrike|Paris
Storbritannia|London
Spania|Madrid
Italia|Roma
Tyskland|Berlin`,(x,a)=>`${a} er hovedstaden i ${x}.`);
 group('world',0,'landemerker',x=>`I hvilket land ligger ${x}?`,`
Eiffeltårnet|Frankrike
Colosseum|Italia
pyramidene i Giza|Egypt
Taj Mahal|India
Den kinesiske mur|Kina
Frihetsgudinnen i New York|USA
operahuset i Sydney|Australia
Machu Picchu|Peru
Kristusstatuen i Rio de Janeiro|Brasil
Akropolis i Athen|Hellas`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} ligger i ${a}.`);
 group('world',0,'kontinent',x=>`På hvilket kontinent ligger ${x}?`,`
Kenya|Afrika
Argentina|Sør-Amerika
Japan|Asia
Portugal|Europa
Canada|Nord-Amerika
New Zealand|Oseania
Sør-Korea|Asia
Chile|Sør-Amerika
Marokko|Afrika
Mexico|Nord-Amerika`,(x,a)=>`${x} ligger i ${a}. Her bruker vi den vanlige norske verdensdelinndelingen.`);
 group('world',1,'hovedsteder',x=>x==='Sveits (forbundsbyen)'?'Hvilken by er Sveits sin forbundsby?':`Hvilken by er hovedstad i ${x}?`,`
Canada|Ottawa
Australia|Canberra
Brasil|Brasília
Tyrkia|Ankara
Sveits (forbundsbyen)|Bern
New Zealand|Wellington
Marokko|Rabat
Vietnam|Hanoi
Nigeria|Abuja
Pakistan|Islamabad`,(x,a)=>`${a} er ${x==='Sveits (forbundsbyen)'?'Sveits sin forbundsby':`hovedstaden i ${x}`}.`);
 group('world',1,'elver',x=>x.includes('utløpet')?'Hvilken elv munner ut ved Lisboa?':`Hvilken elv renner gjennom ${x}?`,`
London|Themsen
Paris|Seinen
Roma|Tiber
Budapest|Donau
Kairo|Nilen
Bagdad|Tigris
Warszawa|Wisła
Praha|Vltava
Lisboa (ved utløpet)|Tejo
Köln|Rhinen`,(x,a)=>`${a} renner ${x.includes('utløpet')?'ut ved Lisboa':`gjennom ${x}`}.`);
 group('world',1,'geografi',x=>`Hvilket geografisk navn passer til «${x}»?`,`
verdens høyeste fjell over havet|Mount Everest
verdens dypeste innsjø|Bajkalsjøen
verdens største øy når kontinenter holdes utenfor|Grønland
verdens største varme ørken|Sahara
fjellkjeden langs vestkysten av Sør-Amerika|Andesfjellene
havet mellom Europa og Nord-Afrika|Middelhavet
fjellkjeden mellom Frankrike og Spania|Pyreneene
sundet mellom Marokko og Spania|Gibraltarstredet
kanalen som forbinder Middelhavet og Rødehavet|Suezkanalen
kanalen som forbinder Atlanterhavet og Stillehavet gjennom Mellom-Amerika|Panamakanalen`,(x,a)=>`${a} er navnet på ${x}.`);
 group('world',2,'oy',x=>`Hvilket land tilhører øya ${x}?`,`
Sicilia|Italia
Kreta|Hellas
Hokkaido|Japan
Tasmania|Australia
Madeira|Portugal
Korsika|Frankrike
Gotland|Sverige
Bornholm|Danmark
Jeju|Sør-Korea
Zanzibar (Unguja)|Tanzania`,(x,a)=>`${x} tilhører ${a}.`);
 group('world',2,'grense',x=>`Hvilket av disse landene har landegrense til både ${x}?`,`
Portugal og Frankrike|Spania
Norge og Polen|Russland
Tyskland og Ungarn|Østerrike
Argentina og Peru|Bolivia
India og Afghanistan|Pakistan
Frankrike og Slovenia|Italia
Sverige og Russland|Finland
Polen og Romania|Ukraina
Algerie og Libya|Tunisia
Hellas og Bulgaria|Nord-Makedonia`,(x,a)=>`${a} har landegrense til begge landene.`);
 group('world',2,'hovedsteder',x=>`Hva heter hovedstaden i ${x}?`,`
Mongolia|Ulaanbaatar
Kasakhstan|Astana
Laos|Vientiane
Nepal|Katmandu
Bhutan|Thimphu
Madagaskar|Antananarivo
Namibia|Windhoek
Uruguay|Montevideo
Paraguay|Asunción
Slovenia|Ljubljana`,(x,a)=>`${a} er hovedstaden i ${x}.`);
// DYR OG NATUR
 group('nature',0,'unger',x=>`Hva kalles vanligvis ungen til ${x}?`,`
ku|Kalv
hest|Føll
sau|Lam
geit|Kje
gris|Grisunge
hund|Valp
katt|Kattunge
høne|Kylling
frosk i larvestadiet|Rumpetroll
sommerfugl før puppestadiet|Larve`,(x,a)=>`Ungen til ${x} kalles ${a.toLowerCase()}.`);
 group('nature',0,'dyr',x=>`Hvilket dyr ${x}?`,`
er verdens største nålevende dyr|Blåhval
har verdens lengste hals blant nålevende landdyr|Sjiraff
har en snabel|Elefant
har åtte armer og er et bløtdyr|Åttearmet blekksprut
bygger demninger av blant annet kvister|Bever
lager honning av nektar|Honningbie
er en fugl som svømmer, men ikke flyr|Pingvin
bærer ofte ungene sine i en pung og hopper på kraftige bakbein|Kenguru
spinner et nett for å fange insekter|Edderkopp
har pigger og kan rulle seg sammen|Pinnsvin`,(x,a)=>`${a} ${x.replace(/^er /,'er ')}.`);
 group('nature',0,'planter',x=>`Hvilken plante gir oss ${x}?`,`
eikenøtter|Eik
kongler med pinjekjerner|Pinje
bananer|Bananplante
kakaobønner|Kakaotre
kaffebønner|Kaffeplante
oliven|Oliventre
ris som korn|Risplante
potetknoller|Potetplante
bomullsfibre|Bomullsplante
lønnesirup fra sevje|Sukkerlønn`,(x,a)=>`${a} er planten vi får ${x} fra.`);
 group('nature',1,'dyregruppe',x=>`Hvilken dyregruppe tilhører ${x}?`,`
delfin|Pattedyr
krokodille|Krypdyr
salamander|Amfibier
laks|Beinfisk
sommerfugl|Insekter
skorpion|Edderkoppdyr
hummer|Krepsdyr
snegl|Bløtdyr
sjøstjerne|Pigghuder
meitemark|Leddormer`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} tilhører ${a.toLowerCase()}.`);
 group('nature',1,'okologi',x=>`Hva kalles ${x}?`,`
prosessen der grønne planter lager sukker ved hjelp av lys|Fotosyntese
organismer som bryter ned dødt organisk materiale|Nedbrytere
et dyr som spiser både plantekost og dyr|Alteter
et dyr som hovedsakelig spiser planter|Planteeter
et dyr som jakter på andre dyr|Rovdyr
samspillet mellom levende organismer og miljøet rundt dem|Økosystem
en arts naturlige levested|Habitat
et nettverk som viser hvem som spiser hvem i flere koblede kjeder|Næringsnett
overføring av pollen til et arr på en blomst|Pollinering
vanndamp som går fra planter ut i lufta gjennom bladene|Transpirasjon`,(x,a)=>`${a} er betegnelsen på ${x}.`);
 group('nature',1,'tilpasning',x=>`Hvilket begrep passer til «${x}»?`,`
et dyr som er aktivt om natten|Nattaktivt
et dyr som er aktivt om dagen|Dagaktivt
farger som gjør at et dyr går i ett med omgivelsene|Kamuflasje
et dyr som etterligner et annet dyrs utseende|Mimikry
en art som bare finnes naturlig i ett bestemt område|Endemisk
regelmessig vandring mellom leveområder|Migrasjon
et pelslag under de lengre dekkhårene som isolerer mot kulde|Underull
periodisk utskifting av fuglers fjær|Myting
et dyrs temperatur styres i stor grad av omgivelsene|Vekselvarmt
et dyr produserer varme for å holde kroppstemperaturen relativt stabil|Likevarmt`,(x,a)=>`Begrepet er ${a.toLowerCase()}.`);
 group('nature',2,'celle',x=>`Hvilken celledel ${x}?`,`
inneholder mesteparten av DNA-et i en typisk dyrecelle|Cellekjernen
frigjør energi ved aerob celleånding|Mitokondriet
utfører fotosyntese i planteceller|Kloroplasten
bygger proteiner ut fra informasjon i mRNA|Ribosomet
omgir cellen og regulerer transport inn og ut|Cellemembranen
gir planteceller et stivt ytre lag av blant annet cellulose|Celleveggen
sorterer og pakker proteiner for transport|Golgiapparatet
bryter ned materiale ved hjelp av enzymer i dyreceller|Lysosomet
lagrer mye av vannet i en moden plantecelle|Sentralvakuolen
utgjør et indre nettverk av proteintråder som støtter cellen|Cytoskjelettet`,(x,a)=>`${a} ${x}.`);
 group('nature',2,'botanikk',x=>`Hva heter plantedelen som ${x}?`,`
tar imot pollen på en blomst|Arret
produserer pollen i en blomst|Pollenknappen
forbinder arret med fruktknuten|Griffelen
inneholder frøemnene i en blomst|Fruktknuten
beskytter blomsterknoppen utenfra|Begerbladet
ofte er fargerik og tiltrekker pollinatorer|Kronbladet
transporterer mesteparten av vannet fra rota opp gjennom planten|Vedvevet
transporterer sukker fra blant annet bladene til andre deler av planten|Silvevet
regulerer gassutveksling gjennom små åpninger i bladet|Spalteåpningen
beskytter rotspissen mens den vokser gjennom jorda|Rothetta`,(x,a)=>`${a} er plantedelen som ${x}.`);
 group('nature',2,'fagord',x=>`Hvilket fagord betyr ${x}?`,`
læren om fugler|Ornitologi
læren om insekter|Entomologi
læren om sopp|Mykologi
læren om fisk|Iktyologi
læren om krypdyr og amfibier|Herpetologi
læren om fossiler og fortidens liv|Paleontologi
læren om dyrs atferd|Etologi
læren om arvelighet og gener|Genetikk
læren om samspillet mellom organismer og miljøet|Økologi
læren om klassifisering og navngiving av organismer|Taksonomi`,(x,a)=>`${a} er ${x}.`);
// FILM OG MUSIKK
 group('culture',0,'figurer',x=>`Hvilken filmserie eller film kjenner vi ${x} fra?`,`
Elsa og Anna|Frost
Simba og Mufasa|Løvenes konge
Woody og Buzz Lightyear|Toy Story
Nemo og Marlin|Oppdrag Nemo
Shrek og Esel|Shrek
Harry, Ronny og Hermine|Harry Potter
Darth Vader og Luke Skywalker|Star Wars
Frodo og Gandalf|Ringenes herre
Jack Sparrow|Pirates of the Caribbean
Po, den kungfu-trenende pandaen|Kung Fu Panda`,(x,a)=>`${x} er figurer fra ${a}.`);
 group('culture',0,'instrument',x=>`Hvilket instrument ${x}?`,`
har vanligvis 88 tangenter|Piano
har vanligvis seks strenger og spilles ofte med plekter|Gitar
har fire strenger og holdes under haka|Fiolin
har en trekkbar sleide i messingblåserfamilien|Trombone
har luftbelg og knapper eller tangenter|Trekkspill
har en stor trekantet ramme med mange strenger|Harpe
har vanligvis fire strenger og stammer fra Hawaii|Ukulele
har skinn som slås på med stikker|Tromme
har tre ventiler og en lys messingklang|Trompet
har trestaver som slås på med køller|Xylofon`,(x,a)=>`${a} ${x}.`);
 group('culture',0,'artist',x=>`Hvem er kjent for sangen «${x}»?`,`
Take On Me|a-ha
Dancing Queen|ABBA
Thriller|Michael Jackson
Jolene|Dolly Parton
Yellow Submarine|The Beatles
We Will Rock You|Queen
Hello fra albumet 25|Adele
Shake It Off|Taylor Swift
Born in the U.S.A.|Bruce Springsteen
Like a Virgin|Madonna`,(x,a)=>`«${x}» er kjent fra ${a}.`);
 group('culture',1,'regissor',x=>`Hvem regisserte «${x}»?`,`
Jurassic Park (1993)|Steven Spielberg
Titanic (1997)|James Cameron
Ringenes herre: Ringens brorskap (2001)|Peter Jackson
Inception (2010)|Christopher Nolan
Pulp Fiction (1994)|Quentin Tarantino
Grand Budapest Hotel (2014)|Wes Anderson
Spirited Away (2001)|Hayao Miyazaki
Barbie (2023)|Greta Gerwig
Parasitt (2019)|Bong Joon-ho
Fargo (1996)|Joel Coen`,(x,a)=>`${a} regisserte «${x}».`);
 group('culture',1,'musikkord',x=>`Hva betyr «${x}» i musikk?`,`
forte|Sterkt
piano som dynamikkangivelse|Svakt
crescendo|Gradvis sterkere
diminuendo|Gradvis svakere
allegro|Hurtig
adagio|Langsomt
legato|Sammenbundet
staccato|Kort og atskilt
accelerando|Gradvis raskere
ritardando|Gradvis langsommere`,(x,a)=>`«${x}» angir at musikken skal spilles ${a.toLowerCase()}.`);
 group('culture',1,'komponist',x=>`Hvem komponerte ${x}?`,`
«I Dovregubbens hall»|Edvard Grieg
«De fire årstider»|Antonio Vivaldi
«Tryllefløyten»|Wolfgang Amadeus Mozart
«Svanesjøen»|Pjotr Tsjajkovskij
«Für Elise»|Ludwig van Beethoven
«Messias»|Georg Friedrich Händel
«Boléro»|Maurice Ravel
«Carmen»|Georges Bizet
«Finlandia»|Jean Sibelius
«Clair de lune» fra Suite bergamasque|Claude Debussy`,(x,a)=>`${x} ble komponert av ${a}.`);
 group('culture',2,'filmfag',x=>`Hvilket filmbegrep beskriver ${x}?`,`
en sammenhengende tagning uten synlige klipp|Langtagning
klipping mellom to handlinger som foregår parallelt|Kryssklipping
at kameraet roterer horisontalt fra et fast punkt|Panorering
at kameraet roterer vertikalt fra et fast punkt|Tilting
at kameraet fysisk beveges på en vogn eller skinne|Dollybevegelse
en stor avbildning av for eksempel et ansikt|Nærbilde
lyd som har en kilde inne i filmens handlingsverden|Diegetisk lyd
en tydelig overgang bakover i fortellingens tid|Tilbakeblikk
at et bilde gradvis erstattes av et annet mens begge er synlige|Overtoning
et brått klipp mellom to nesten like utsnitt som gir et synlig rykk|Jump cut`,(x,a)=>`${a} betegner ${x}.`);
 group('culture',2,'musikkteori',x=>`Hvilket musikkbegrep passer til «${x}»?`,`
intervallet fra C til neste C|Oktav
intervallet fra C opp til G innen samme oktav|Ren kvint
intervallet fra C opp til E innen samme oktav|Stor ters
intervallet fra C opp til Ess innen samme oktav|Liten ters
intervallet fra C opp til F innen samme oktav|Ren kvart
intervallet fra C opp til Fiss innen samme oktav|Tritonus
en treklang med grunntone, stor ters og ren kvint|Durtreklang
en treklang med grunntone, liten ters og ren kvint|Molltreklang
flere selvstendige melodistemmer samtidig|Polyfoni
en melodilinje uten harmonisk akkompagnement|Monofoni`,(x,a)=>`Betegnelsen er ${a.toLowerCase()}.`);
 group('culture',2,'filmhistorie',x=>`Hvilket år hadde filmen «${x}» sin første premiere?`,`
Metropolis|1927
Trollmannen fra Oz|1939
Citizen Kane|1941
Sykkeltyvene|1948
Singin' in the Rain|1952
Psycho|1960
2001: En romodyssé|1968
Gudfaren|1972
Haisommer|1975
Blade Runner|1982`,(x,a)=>`«${x}» hadde sin første premiere i ${a}.`);
// SPORT OG SPILL
 group('sport',0,'utstyr',x=>`Hvilken idrett forbindes spesielt med ${x}?`,`
puck og skøyter|Ishockey
fjærball og racket|Badminton
balltre, slagmann og pitcher|Baseball
børste, steiner og isbane|Curling
kølle, hull og green|Golf
piler og en rund skive|Dart
bue, pil og blink|Bueskyting
boksehansker og boksering|Boksing
kurv, dribling og dunk|Basketball
springbrett, bom og ringer|Turn`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} er typisk utstyr eller begreper i ${a.toLowerCase()}.`);
 group('sport',0,'brettspill',x=>`Hvilket spill har ${x}?`,`
konge, dronning og bønder|Sjakk
hus, hoteller og gater som kjøpes|Monopol
ord som bygges med bokstavbrikker på et brett|Scrabble
fem terninger og kombinasjoner som fullt hus|Yatzy
fargede brikker som flyttes fra et hjørne til mål etter terningkast|Ludo
brikker med to felt med prikker|Domino
spørsmålskategorier og små kakestykker i en brikke|Trivial Pursuit
et 19 × 19-brett og svarte og hvite steiner|Go
15 brikker per spiller og 24 smale trekanter på brettet|Backgammon
ni ruter der du prøver å få tre tegn på rad|Tre på rad`,(x,a)=>`${a} kjennes igjen på ${x}.`);
 group('sport',0,'sportnavn',x=>`Hvilken idrett kombinerer eller bruker ${x}?`,`
langrenn og skyting|Skiskyting
svømming, sykling og løping|Triatlon
hopp og langrenn|Kombinert
løping og passering av hekker|Hekkeløp
løping og hopp med en lang stav|Stavsprang
kart og kompass i terrenget|Orientering
sabel, florett eller kårde|Fekting
padling i en smal båt med dobbeltbladet åre|Kajakk
ridebane, hest og hindringer|Sprangridning
å løfte en vektstang i rykk eller støt|Vektløfting`,(x,a)=>`${a} bruker eller kombinerer ${x}.`);
 group('sport',1,'antall',x=>`Hvor mange ${x}?`,`
spillere kan et lag maksimalt ha på banen i vanlig elleverfotball|11
spillere kan et innendørs håndballag maksimalt ha på banen samtidig|7
spillere har et basketballag på banen samtidig|5
spillere har et innendørs volleyballag på banen samtidig|6
spillere kan et rugby union-lag maksimalt ha på banen samtidig|15
spillere har hvert lag i sandvolleyball|2
poeng gir et touchdown før ekstrapoeng i amerikansk fotball|6
poeng gir et straffekast i basketball|1
poeng gir et skudd bak trepoengslinjen i basketball|3
ringer har det olympiske symbolet|5`,(x,a)=>`Antallet er ${a}.`);
 group('sport',1,'sjakk',x=>`Hvilken sjakkbrikke ${x}?`,`
flytter ett felt i alle retninger, men ikke inn i sjakk|Kongen
kan flytte både som et tårn og en løper|Dronningen
flytter vannrett eller loddrett så langt veien er fri|Tårnet
flytter diagonalt så langt veien er fri|Løperen
hopper i en L-form og kan hoppe over brikker|Springeren
flytter fremover, men slår ett felt diagonalt|Bonden
må ikke kunne fanges i en lovlig stilling|Kongen
kan velges ved bondeforvandling og er den sterkeste brikken|Dronningen
starter på a1 for hvit|Tårnet
starter på b1 for hvit|Springeren`,(x,a)=>`${a} er brikken som ${x}.`);
 group('sport',1,'vert',x=>`Hvilken by arrangerte sommer-OL i ${x}?`,`
2000|Sydney
2004|Athen
2008|Beijing
2012|London
2016|Rio de Janeiro
2020 (avholdt i 2021)|Tokyo
1992|Barcelona
1988|Seoul
1980|Moskva
1976|Montréal`,(x,a)=>`Sommer-OL ${x} ble arrangert i ${a}.`);
 group('sport',2,'distanse',x=>`Hva er standarddistansen eller -målet for ${x}?`,`
et maratonløp|42,195 km
et halvmaratonløp|21,0975 km
én runde i bane 1 på en standard utendørs friidrettsbane|400 m
lengden på et olympisk langbanebasseng|50 m
lengden på et kortbanebasseng|25 m
høyden til overkanten av en basketballkurv|3,05 m
bredden mellom stolpene i et vanlig elleverfotballmål|7,32 m
høyden på et vanlig elleverfotballmål|2,44 m
høyden på volleyballnettet for senior menn|2,43 m
høyden på volleyballnettet for senior kvinner|2,24 m`,(x,a)=>`Standardmålet for ${x} er ${a}.`);
 group('sport',2,'terminologi',x=>`Hva kalles «${x}»?`,`
tre slag under par på ett hull i golf|Albatross
to slag under par på ett hull i golf|Eagle
ett slag under par på ett hull i golf|Birdie
ett slag over par på ett hull i golf|Bogey
lik stilling ved 40–40 i tennis|Deuce
et servepoeng der mottakeren ikke berører ballen i tennis|Ess
en lovlig sjakkstilling der spilleren ikke har lovlige trekk, men ikke er i sjakk|Patt
et trekk der konge og tårn flyttes i samme sjakktrekk|Rokade
en bonde som når motsatt enderad og byttes til en annen brikke|Bondeforvandling
at en bonde slår en annen bonde som nettopp har gått to felt forbi slagfeltet|En passant`,(x,a)=>`Dette kalles ${a.toLowerCase()}.`);
 group('sport',2,'historie',x=>`Hvilket år ${x}?`,`
ble de første moderne sommer-OL arrangert i Athen|1896
ble de første olympiske vinterlekene holdt i Chamonix|1924
ble de første fotball-VM-sluttspillkampene spilt i Uruguay|1930
arrangerte Oslo vinter-OL|1952
arrangerte Lillehammer vinter-OL|1994
vant Norge sitt første VM-gull i fotball for kvinner|1995
vant Norge EM i fotball for kvinner i Italia|1993
vant Magnus Carlsen VM-tittelen i klassisk sjakk for første gang|2013
vant Bobby Fischer VM-matchen mot Boris Spasskij|1972
arrangerte Seoul sommer-OL|1988`,(x,a)=>`Det skjedde i ${a}.`);
// VITENSKAP OG TEKNOLOGI
 group('science',0,'solsystem',x=>`Hvilket himmellegeme ${x}?`,`
er stjernen i sentrum av solsystemet|Solen
er planeten nærmest Solen|Merkur
er planeten mellom Merkur og Jorden|Venus
er planeten vi bor på|Jorden
kalles den røde planeten|Mars
er solsystemets største planet|Jupiter
er særlig kjent for sitt store, tydelige ringsystem|Saturn
er planeten mellom Saturn og Neptun|Uranus
er planeten lengst fra Solen blant de åtte planetene|Neptun
er Jordens naturlige satellitt|Månen`,(x,a)=>`${a} ${x}.`);
 group('science',0,'hverdag',x=>`Hva heter prosessen når ${x}?`,`
is blir til flytende vann|Smelting
flytende vann blir til is|Frysing
flytende vann går over til vanndamp fra overflaten|Fordamping
vanndamp blir til vanndråper|Kondensering
jern reagerer med oksygen og fuktighet og danner rust|Rusting
ved brenner med oksygen|Forbrenning
sukker blandes jevnt inn i vann uten å reagere kjemisk|Oppløsning
sand skilles fra vann med et kaffefilter|Filtrering
vann blir varmet til det dannes dampbobler i hele væsken|Koking
en vann-saltløsning skilles ved å fordampe og deretter kondensere vannet|Destillasjon`,(x,a)=>`Prosessen kalles ${a.toLowerCase()}.`);
 group('science',0,'enheter',x=>`Hvilken enhet brukes vanligvis til å måle ${x}?`,`
lengde i SI-systemet|Meter
masse i SI-systemet|Kilogram
tid i SI-systemet|Sekund
elektrisk strøm i SI-systemet|Ampere
temperatur i SI-systemet|Kelvin
energi i SI-systemet|Joule
effekt i SI-systemet|Watt
kraft i SI-systemet|Newton
elektrisk spenning i SI-systemet|Volt
frekvens i SI-systemet|Hertz`,(x,a)=>`${a} er enheten for ${x}.`);
 group('science',1,'symbol',x=>`Hvilket grunnstoff har kjemisk symbol ${x}?`,`
H|Hydrogen
O|Oksygen
C|Karbon
N|Nitrogen
Fe|Jern
Cu|Kobber
Ag|Sølv
Au|Gull
Na|Natrium
K|Kalium`,(x,a)=>`${x} er det kjemiske symbolet for ${a.toLowerCase()}.`);
 group('science',1,'data',x=>`Hvilket begrep passer til «${x}»?`,`
den minste binære informasjonsenheten|Bit
en gruppe på åtte biter|Byte
arbeidsminne som vanligvis mister innholdet uten strøm|RAM
prosessoren som utfører instruksjoner|CPU
en adresse som identifiserer en ressurs på nettet|URL
systemet som oversetter domenenavn til blant annet IP-adresser|DNS
et lokalt nettverk uten trådløs forbindelse, typisk med nettverkskabler|Kablet LAN
et sett med regler for kommunikasjon mellom systemer|Protokoll
en trinnvis oppskrift for å løse en oppgave|Algoritme
en ekstra kopi av data som kan brukes ved tap|Sikkerhetskopi`,(x,a)=>`${a} er betegnelsen på ${x}.`);
 group('science',1,'fysikk',x=>`Hvilken fysisk størrelse måler vi i ${x}?`,`
pascal|Trykk
coulomb|Elektrisk ladning
ohm|Elektrisk motstand
farad|Kapasitans
tesla|Magnetisk flukstetthet
weber|Magnetisk fluks
henry|Induktans
lumen|Lysstrøm
lux|Belysningsstyrke
becquerel|Radioaktiv aktivitet`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} er SI-enheten for ${a.toLowerCase()}.`);
 group('science',2,'grunnstoff',x=>`Hvilket grunnstoff har atomnummer ${x}?`,`
2|Helium
3|Litium
6|Karbon
8|Oksygen
14|Silisium
26|Jern
29|Kobber
47|Sølv
79|Gull
92|Uran`,(x,a)=>`${a} har ${x} protoner i atomkjernen og dermed atomnummer ${x}.`);
 group('science',2,'begreper',x=>`Hvilket begrep beskriver ${x}?`,`
en partikkel med negativ elektrisk elementærladning|Elektron
en positivt ladd partikkel i atomkjernen|Proton
en elektrisk nøytral partikkel i atomkjernen|Nøytron
atomer av samme grunnstoff med ulikt antall nøytroner|Isotoper
et atom eller molekyl med netto elektrisk ladning|Ion
en partikkel som er lyskvantet|Foton
en binding der atomer deler elektronpar|Kovalent binding
en binding basert på tiltrekning mellom motsatt ladde ioner|Ionebinding
en reaksjon som avgir varme til omgivelsene|Eksoterm reaksjon
en reaksjon som tar opp varme fra omgivelsene|Endoterm reaksjon`,(x,a)=>`Dette beskriver ${a.toLowerCase()}.`);
 group('science',2,'it',x=>`Hvilket teknologibegrep passer til «${x}»?`,`
en funksjon som kaller seg selv|Rekursjon
en datastruktur der sist inn blir først ut|Stakk
en datastruktur der først inn blir først ut|Kø
å finne et element ved å halvere et sortert søkeområde gjentatte ganger|Binærsøk
at to tråder venter på hverandres ressurser og ingen kommer videre|Vranglås
en uforanderlig verdi eller datastruktur|Immutabel
en operasjon som kan gjentas med samme effekt som én utførelse|Idempotent
å lagre en beregnet verdi for å slippe å beregne den igjen|Memoisering
å oversette en verdi til en kompakt kontrollverdi med en hashfunksjon|Hashing
å beskytte innhold ved å gjøre det uleselig uten riktig nøkkel|Kryptering`,(x,a)=>`Begrepet er ${a.toLowerCase()}.`);
