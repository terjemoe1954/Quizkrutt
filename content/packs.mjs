// Egenformulert, statisk innhold. Ingen spørsmål hentes eller genereres under spill.
function facts(prompt,lines,explain){const rows=lines.trim().split('\n').map(x=>x.split('|'));return rows.map(([label,correct,note],i)=>{const choices=[...new Set(rows.map(r=>r[1]))].filter(a=>a!==correct);const offset=i%Math.max(1,choices.length-2);return {question:prompt(label),options:[correct,...choices.slice(offset,offset+3)],correct:0,explanation:note||explain(label,correct)};});}
const pack=(id,title,description,category,level,questions)=>({schema:1,id,version:1,title,description,category,level,questions:questions.map((q,i)=>({id:`${id}-${i+1}`,...q}))});
export const packs=[
pack('norge-byrunde','Norge: en liten byrunde','Fra brygger og broer til kjente norske landemerker.','world',0,[
...facts(x=>`I hvilken norsk by finner du ${x}?`,`
Nidarosdomen|Trondheim
Bryggen, den historiske trehusbebyggelsen ved Vågen|Bergen
operaen i Bjørvika|Oslo
Ishavskatedralen|Tromsø
Sverd i fjell ved Hafrsfjord|Stavanger
Atlanterhavsparken|Ålesund
Den norske bokbyen ved Skagerrak|Tvedestrand
Kilden teater og konserthus|Kristiansand
hvalfangstmonumentet av Knut Steen|Sandefjord
Maihaugen|Lillehammer`,(x,a)=>`${x[0].toUpperCase()+x.slice(1)} ligger i ${a}.`),
...facts(x=>`Hvilken norsk by forbindes med ${x}?`,`
Nidelva og Bakklandet|Trondheim
Fløibanen og Ulriken|Bergen
Akerselva og Holmenkollen|Oslo
Polaria og Fjellheisen|Tromsø
Gamle Stavanger og Norsk Oljemuseum|Stavanger
jugendstil og Aksla|Ålesund
Slottsfjellet og kunstmuseet Haugar|Tønsberg
Fiskebrygga og Posebyen|Kristiansand
Gamlebyen ved Glomma|Fredrikstad
Bragernes og Ypsilonbrua|Drammen`,(x,a)=>`${a} forbindes med ${x}.`)
]),
pack('norge-natur','Norske naturperler','Fjell, fjorder og landskap fra nord til sør.','world',1,[
...facts(x=>`Hvilket norsk stedsnavn passer til «${x}»?`,`
Norges høyeste fjell over havet|Galdhøpiggen
Norges største innsjø målt i overflateareal|Mjøsa
Norges lengste elv|Glomma
Norges lengste fjord|Sognefjorden
Norges dypeste innsjø|Hornindalsvatnet
det største platået med fjellvidde i Sør-Norge|Hardangervidda
fjellområdet der Besseggen ligger|Jotunheimen
fjellformasjonen som ruver over Lysefjorden og har et flatt platå|Preikestolen
øya med vulkanen Beerenberg|Jan Mayen
øya som er størst i øygruppen Svalbard|Spitsbergen`,(x,a)=>`${a} er ${x}.`),
...facts(x=>`Hvilken norsk elv renner ${x}?`,`
gjennom Trondheim sentrum|Nidelva
gjennom Drammen sentrum|Drammenselva
fra Mjøsa til samløpet med Glomma ved Årnes|Vorma
gjennom Bagn i Valdres|Begna
gjennom Kongsberg sentrum|Numedalslågen
gjennom Kristiansand sentrum|Otra
gjennom Alta og ut i Altafjorden|Altaelva
gjennom Oslo fra Maridalsvannet til Oslofjorden|Akerselva
gjennom sentrum av Førde|Jølstra
sammen med Anárjohka og danner Tanaelva|Kárášjohka|Kárášjohka møter Anárjohka og danner Tanaelva.`,(x,a)=>`${a} renner ${x}.`)
]),
pack('film-favoritter','Filmkveld med favoritter','Møt nye figurer og kjenn igjen animerte filmverdener.','culture',0,[
...facts(x=>`Hvilken animasjonsfilm kjenner vi ${x} fra?`,`
Remy, rotta som vil bli kokk|Ratatouille
WALL-E og EVE|WALL-E
Carl Fredricksen og speideren Russell|Se opp
Hikke og dragen Tannløs|Dragetreneren
Judy Hopps og Nick Wilde|Zootropolis
Lynet McQueen og Bill|Biler
Glede og Sorg inne i hodet til Riley|Innsiden ut
Miguel og skjelettet Héctor|Coco
Familien Parr med superkrefter|De utrolige
Merida, prinsessen med bue|Modig`,(x,a)=>`${x} er figurer i «${a}».`),
...facts(x=>`Hvilken film eller filmserie har ${x}?`,`
et magisk brettspill som vekker jungeldyr til live i 1995-filmen|Jumanji
en utenomjordisk venn som vil «phone home»|E.T.
Marty McFly og en tidsreisende DeLorean|Tilbake til fremtiden
Kevin McCallister som forsvarer huset mot to innbruddstyver|Hjemme alene
en familie som finner en bjørn fra Peru på en jernbanestasjon|Paddington
Dorothy, Toto og en gul brosteinsvei|Trollmannen fra Oz
Mary Poppins og familien Banks|Mary Poppins
Peter Parker som klatrer på vegger|Spider-Man
arkeologen Indiana Jones|Indiana Jones
Aslan, løven i et land bak et klesskap|Legenden om Narnia`,(x,a)=>`Dette kjenner vi fra «${a}».`)
]),
pack('film-klassikere','Bak filmklassikerne','Regissører, filmhistorie og navn for filmelskere.','culture',2,[
...facts(x=>`Hvem regisserte «${x}»?`,`
Citizen Kane (1941)|Orson Welles
Psycho (1960)|Alfred Hitchcock
Gudfaren (1972)|Francis Ford Coppola
2001: En romodyssé (1968)|Stanley Kubrick
Blade Runner (1982)|Ridley Scott
De syv samuraier (1954)|Akira Kurosawa
Persona (1966)|Ingmar Bergman
8½ (1963)|Federico Fellini
Sykkeltyvene (1948)|Vittorio De Sica
Metropolis (1927)|Fritz Lang`,(x,a)=>`${a} regisserte «${x}».`),
...facts(x=>`Hvilken skuespiller spilte ${x}?`,`
Rick Blaine i Casablanca (1942)|Humphrey Bogart
Dorothy i Trollmannen fra Oz (1939)|Judy Garland
Holly Golightly i Breakfast at Tiffany's (1961)|Audrey Hepburn
Vito Corleone i Gudfaren (1972)|Marlon Brando
Ellen Ripley i Alien (1979)|Sigourney Weaver
Sarah Connor i The Terminator (1984)|Linda Hamilton
Travis Bickle i Taxi Driver (1976)|Robert De Niro
Clarice Starling i Nattsvermeren (1991)|Jodie Foster
Forrest Gump i filmen fra 1994|Tom Hanks
Neo i The Matrix (1999)|Keanu Reeves`,(x,a)=>`${a} spilte ${x}.`)
]),
pack('rom-reiser','På romferd','Oppdag oppdragene, fartøyene og menneskene bak romreisene.','science',1,[
...facts(x=>`Hvilket romfartsnavn passer til «${x}»?`,`
det første bemannede oppdraget som landet på Månen|Apollo 11
den første kunstige satellitten i bane rundt Jorden|Sputnik 1
romfartøyet som fraktet Jurij Gagarin rundt Jorden|Vostok 1
NASAs første romferge som fløy i verdensrommet|Columbia
romteleskopet som ble skutt opp i 1990|Hubble
romteleskopet som ble skutt opp 25. desember 2021|James Webb
ESA-landeren som landet på kometen 67P i 2014|Philae
NASA-roveren som landet på Mars i 2012|Curiosity
NASA-roveren som landet på Mars i 2021|Perseverance
NASAs lille helikopter som fløy på Mars i 2021|Ingenuity`,(x,a)=>`Dette beskriver ${a}.`),
...facts(x=>`Hvem ${x}?`,`
var det første mennesket i verdensrommet|Jurij Gagarin
var den første kvinnen i verdensrommet|Valentina Teresjkova
var det første mennesket som gikk på Månen|Neil Armstrong
var det andre mennesket som gikk på Månen|Buzz Aldrin
ble igjen i kommandomodulen under Apollo 11s månelanding|Michael Collins
var det første mennesket på en romvandring|Aleksej Leonov
var den første amerikaneren i verdensrommet|Alan Shepard
var den første amerikaneren i bane rundt Jorden|John Glenn
var den første amerikanske kvinnen i verdensrommet|Sally Ride
var den første svenske astronauten i verdensrommet|Christer Fuglesang`,(x,a)=>`${a} ${x.replace(/^var /,'var ').replace(/^ble /,'ble ')}.`)
]),
pack('rom-fenomener','Universets hemmeligheter','Stjerner, baner og fenomener for ekstra nysgjerrige hoder.','science',2,[
...facts(x=>`Hvilket astronomisk begrep beskriver ${x}?`,`
en stjernes voldsomme eksplosjon ved slutten av livet|Supernova
en roterende nøytronstjerne som observeres som regelmessige pulser|Pulsar
et område der gravitasjonen er så sterk at ikke engang lys slipper ut innenfra|Svart hull
en enorm samling av stjerner, gass, støv og mørk materie|Galakse
en sky av gass og støv i verdensrommet|Tåke
en aktiv galaksekjerne som kan lyse svært sterkt når gass faller mot et supermassivt svart hull|Kvasar
en planet som går i bane rundt en annen stjerne enn Solen|Eksoplanet
lyset fra et fjernt objekt forskyves mot lengre bølgelengder|Rødforskyvning
at gravitasjon bøyer lys og kan forstørre et fjernt objekt|Gravitasjonslinse
svak mikrobølgestråling som fyller universet og stammer fra det tidlige universet|Kosmisk bakgrunnsstråling`,(x,a)=>`Begrepet er ${a.toLowerCase()}.`),
...facts(x=>`Hvilket begrep betyr «${x}»?`,`
punktet der et objekt i bane rundt Solen er nærmest Solen|Perihel
punktet der et objekt i bane rundt Solen er lengst fra Solen|Aphel
punktet der en satellitt i bane rundt Jorden er nærmest Jorden|Perigeum
punktet der en satellitt i bane rundt Jorden er lengst fra Jorden|Apogeum
en tilsynelatende forskyvning når en stjerne ses fra ulike steder i Jordens bane|Parallakse
avstanden lyset tilbakelegger i vakuum i løpet av ett juliansk år|Lysår
en avstandsenhet som svarer til parallaksevinkelen ett buesekund|Parsec
Solens tilsynelatende bane over himmelkulen gjennom året|Ekliptikken
en hendelse der et objekt passerer foran et annet og dekker en liten del av det|Transitt
banepunktet der en satellitt krysser referanseplanet fra sør mot nord|Oppstigende knute`,(x,a)=>`Dette kalles ${a.toLowerCase()}.`)
])
];
