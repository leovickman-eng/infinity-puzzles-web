export interface CharacterData {
  id: number;
  name: string;
  animal: { sv: string; en: string };
  neighbors: string[];
  superpower: { sv: string; en: string };
  tagline: { sv: string; en: string };
  description: { sv: string; en: string };
  aura: { sv: string; en: string };
}

export const CHARACTER_DATA: CharacterData[] = [
  {
    id: 1,
    name: 'Dolores',
    animal: { sv: 'Narval', en: 'Narwhal' },
    neighbors: ['Zuki', 'Tanya', 'Ronda', 'Mira'],
    superpower: {
      sv: 'Simmar mot mörkret när alla andra simmar bort.',
      en: 'Swims toward the dark when everyone else swims away.',
    },
    tagline: {
      sv: 'Hon är redan i vattnet när ni kommer fram.',
      en: 'She is already in the water when you arrive.',
    },
    description: {
      sv: 'De kallade henne enhörningen av havet innan de visste vad hon var.\n\nDolores horn kan känna stormar innan de bildas och lögner på samma sätt. Det är därför hon alltid simmar mot mörkret utan att tveka — hon har redan känt vad som finns där inne.\n\nDet ovanliga: På medeltiden såldes narvalhornet som enhörningshorn för mer guld än sin vikt. Drottningar fick dem i present. Kejsare betalade nationsskulder för att äga ett. De trodde det botade gift och bröt förbannelser. De hade fel om vad det var. Men rätt om att det var magiskt.',
      en: 'They called her the unicorn of the sea before they knew what she was.\n\nDolores\' horn can sense storms before they form and lies in the same way. That is why she always swims toward the dark without hesitating — she has already felt what is in there.\n\nThe unusual: In the Middle Ages narwhal horns were sold as unicorn horns for more gold than their weight. Queens received them as gifts. Emperors paid off national debts to own one. They believed it cured poison and broke curses. They were wrong about what it was. But right that it was magical.',
    },
    aura: {
      sv: 'Runt Dolores vågar man lite mer. Man känner att man klarar saker man inte trodde sig klara. Som om hennes mod lånar ut sig en stund.',
      en: 'Around Dolores you dare a little more. You feel like you can handle things you didn\'t think you could. As if her courage lends itself out for a while.',
    },
  },
  {
    id: 2,
    name: 'Zuki',
    animal: { sv: 'Rådjur', en: 'Deer' },
    neighbors: ['Dolores', 'Tanya', 'Mambo Viento', 'Mani', 'Daffy Giraffy', 'Rumi', 'Ronda'],
    superpower: {
      sv: 'Ser världen som om det är första gången.',
      en: 'Sees the world as if for the first time.',
    },
    tagline: {
      sv: 'Hon ställer frågan ingen annan tänkt på — och den förändrar allt.',
      en: 'She asks the question nobody else thought of — and it changes everything.',
    },
    description: {
      sv: 'Zuki springer lite för fort, frågar lite för mycket och stannar mitt i allting för att stirra på en blomma som om det är den första blomman hon sett.\n\nDet är det. Nästan alltid.\n\nDe allra klokaste vet redan svaret innan de ställt frågan. Zuki vet inte svaret. Och det är precis därför hon ser saker ingen annan ser. Ingen av dem vet det ännu. Men Zuki är den viktigaste av alla nitton.\n\nDet ovanliga: Rådjur föds utan doft — mamman slickar dem rena direkt efter födseln så rovdjur inte ska hitta dem. De börjar livet osynliga.',
      en: 'Zuki runs a little too fast, asks a little too much, and stops in the middle of everything to stare at a flower as if it\'s the first flower she has ever seen.\n\nIt is. Almost always.\n\nThe wisest ones already know the answer before they ask the question. Zuki doesn\'t know the answer. And that is exactly why she sees things nobody else sees. None of them know it yet. But Zuki is the most important of all nineteen.\n\nThe unusual: Deer are born without scent — the mother licks them clean immediately after birth so predators can\'t find them. They begin life invisible.',
    },
    aura: {
      sv: 'Runt Zuki minns man hur det kändes att se världen för första gången. Man blir lite nyfiken igen. Lite mer öppen. Lite mer glad.',
      en: 'Around Zuki you remember what it felt like to see the world for the first time. You become a little more curious. A little more open. A little more happy.',
    },
  },
  {
    id: 3,
    name: 'Mani',
    animal: { sv: 'Tukan', en: 'Toucan' },
    neighbors: ['Zuki', 'Ziggy-Lou', 'Mambo Viento', 'Daffy Giraffy', 'Jerry'],
    superpower: {
      sv: 'Lyssnar på det ingen annan hör.',
      en: 'Listens to what nobody else can hear.',
    },
    tagline: {
      sv: 'Hon vet svaret innan frågan är ställd.',
      en: 'She knows the answer before the question is asked.',
    },
    description: {
      sv: 'I djungeln finns ett träd som alla djuren vet om men sällan talar om. Inte det högsta. Inte det vackraste. Men alltid det lugnaste. På den grenen som böjer sig lite åt vänster sitter Mani — och lyssnar på något under allt det vanliga. Något tyst och gammalt och alltid rätt.\n\nHon lämnar alltid ledtrådar istället för svar. En fjäder på fel ställe. En gren som pekar åt ett håll. Saker som ser ut som slumpen men aldrig är det.\n\nDet ovanliga: Tukanens näbb fungerar som ett eget värmesystem — inuti löper tusentals blodkärl som den öppnar och stänger för att reglera temperaturen i hela kroppen. Den bär termostaten i sitt ansikte.',
      en: 'In the jungle there is a tree that all the animals know about but rarely speak of. Not the tallest. Not the most beautiful. But always the quietest. On the branch that bends slightly to the left sits Mani — listening to something beneath all the ordinary noise. Something quiet and ancient and always right.\n\nShe always leaves clues instead of answers. A feather in the wrong place. A branch pointing one way. Things that look like coincidence but never are.\n\nThe unusual: A toucan\'s beak works as its own heating system — inside run thousands of blood vessels it opens and closes to regulate the temperature of its entire body. It carries its thermostat in its face.',
    },
    aura: {
      sv: 'Runt Mani börjar man tro att det ordnar sig. Inte för att hon säger det — utan för att hon är det. Hoppet känns plötsligt rimligt.',
      en: 'Around Mani you start to believe things will work out. Not because she says so — but because she is it. Hope suddenly feels possible.',
    },
  },
  {
    id: 4,
    name: 'Ziggy-Lou',
    animal: { sv: 'Räv', en: 'Fox' },
    neighbors: ['Mani', 'Lana', 'Dali', 'Pinto', 'Sixten', 'Jerry'],
    superpower: {
      sv: 'Ser allt utan att verka se något.',
      en: 'Sees everything without seeming to see anything.',
    },
    tagline: {
      sv: 'Hon minns vad du sa för tre månader sedan och frågar om det precis när det spelar som mest roll.',
      en: 'She remembers what you said three months ago and asks about it exactly when it matters most.',
    },
    description: {
      sv: 'Ziggy-Lou var redan där när de kom. Det är hon alltid.\n\nHon hör saker andra inte hör, minns saker andra glömmer och ler ett leende som ser varmt ut men aldrig riktigt berättar vad hon tänker. Folk tror de förstår henne. Det gör de inte. Det är inte hennes fel. Det är bara så hon är.\n\nDet ovanliga: Rävar navigerar med jordens magnetfält. De ser det som ett mörker med en glödande fläck — och hoppar alltid mot den fläcken när de jagar. De ser något osynligt som ingen annan ser.',
      en: 'Ziggy-Lou was already there when they arrived. She always is.\n\nShe hears things others don\'t hear, remembers things others forget, and smiles a smile that looks warm but never quite tells you what she\'s thinking. People think they understand her. They don\'t. It\'s not her fault. It\'s just how she is.\n\nThe unusual: Foxes navigate using the earth\'s magnetic field. They see it as a darkness with a glowing spot — and always jump toward that spot when they hunt. They see something invisible that nobody else can see.',
    },
    aura: {
      sv: 'Runt Ziggy-Lou blir man lite skarpare. Man börjar lägga märke till saker man annars missat. Som om luften blivit lite tydligare.',
      en: 'Around Ziggy-Lou you become a little sharper. You start noticing things you would otherwise have missed. As if the air has become a little clearer.',
    },
  },
  {
    id: 5,
    name: 'Lana',
    animal: { sv: 'Lama', en: 'Llama' },
    neighbors: ['Ziggy-Lou', 'Tanya', 'Sixten', 'Jerry', 'Mira'],
    superpower: {
      sv: 'Bär alltid på sanningen.',
      en: 'Always carries the truth.',
    },
    tagline: {
      sv: 'Hon säger det med ett halvt leende och tre dagar senare förstår man att hon hade rätt.',
      en: 'She says it with a half smile and three days later you realize she was right.',
    },
    description: {
      sv: 'Lana Manana går aldrig in i ett rum — hon anländer. Väljer varje ord som om ord är dyrbara och man inte ska slösa med dem. Varje mening landar som ett litet domslut.\n\nUnder all den stolthet bryr hon sig om en enda sak — vad som faktiskt är sant. Inte vad som är bekvämt. Inte vad som ser bäst ut. Vad som är sant.\n\nDet ovanliga: Laman är ett av få djur som spottar som försvar — men bara när den är genuint förolämpad. Den bestämmer själv när du förtjänar det. Lana Manana har aldrig spottat på någon. Men hon har tänkt på det.',
      en: 'Lana Manana never enters a room — she arrives. She chooses every word as if words are precious and not to be wasted. Every sentence lands like a small verdict.\n\nBeneath all that pride she cares about one single thing — what is actually true. Not what is comfortable. Not what looks best. What is true.\n\nThe unusual: The llama is one of the few animals that spits as a defense — but only when genuinely offended. It decides for itself when you deserve it. Lana Manana has never spat on anyone. But she has thought about it.',
    },
    aura: {
      sv: 'Runt Lana sitter man lite rakare. Talar lite tydligare. Man påminns om att man också kan vara sig själv — ordentligt.',
      en: 'Around Lana you sit a little straighter. Speak a little clearer. You are reminded that you too can be yourself — properly.',
    },
  },
  {
    id: 6,
    name: 'Tanya',
    animal: { sv: 'Tiger', en: 'Tiger' },
    neighbors: ['Dolores', 'Zuki', 'Lana', 'Mambo Viento', 'Sixten', 'Mira'],
    superpower: {
      sv: 'Vet alltid vart hon ska.',
      en: 'Always knows where she\'s going.',
    },
    tagline: {
      sv: 'Hon går utan att titta tillbaka — och alla följer efter utan att förstå varför.',
      en: 'She walks without looking back — and everyone follows without understanding why.',
    },
    description: {
      sv: 'Tarah rör sig som om varje steg redan är bestämt innan hon tar det. Ingen brådska. Inget tvivel. Hon förklarar sig aldrig — inte för att hon är arrogant, utan för att förklaringar tar tid och hon redan vet vart hon ska.\n\nDe som är i hennes närhet känner sig plötsligt lite mer säkra på sin egen riktning. Som om hennes visshet smittar.\n\nDet ovanliga: Tigerns randiga mönster finns inte bara i pälsen — även huden under är randig. Ta bort all päls och tigern ser likadan ut. Hon är samma rakt igenom.',
      en: 'Tarah moves as if every step is already decided before she takes it. No rush. No doubt. She never explains herself — not because she is arrogant, but because explanations take time and she already knows where she\'s going.\n\nThose near her suddenly feel a little more certain of their own direction. As if her certainty is contagious.\n\nThe unusual: A tiger\'s stripe pattern exists not only in the fur — the skin underneath is striped too. Remove all the fur and the tiger looks exactly the same. She is the same all the way through.',
    },
    aura: {
      sv: 'Runt Tarah vet man plötsligt vart man ska. Rörigheten lägger sig. Tankarna klarnar. Man känner sig mer sig själv.',
      en: 'Around Tarah you suddenly know where you\'re going. The confusion settles. Your thoughts clear. You feel more like yourself.',
    },
  },
  {
    id: 7,
    name: 'Mambo Viento',
    animal: { sv: 'Drake', en: 'Dragon' },
    neighbors: ['Zuki', 'Mani', 'Tanya', 'Dali', 'Sixten', 'Coco'],
    superpower: {
      sv: 'Reser i tiden.',
      en: 'Travels through time.',
    },
    tagline: {
      sv: 'Han vet redan hur det slutar — och ler ändå det lilla leendet när det händer.',
      en: 'He already knows how it ends — and still smiles the small smile when it does.',
    },
    description: {
      sv: 'Ingen har sett Mambo landa. Han bara — finns plötsligt där.\n\nHan bär alltid en liten svart sten gömd under en av vingfjädrarna som han aldrig sätter ner. Om man tittar på den i rätt ljus ser den ut att röra sig inifrån. Som om något andas därinne. Ingen har frågat honom om den. De som känner Mambo vet att man inte frågar om saker han inte tagit upp själv.\n\nDet ovanliga: Varje kultur på jorden — Europa, Kina, Afrika, Amerika — har drömt om drakar. Utan att känna varandra. Utan att ha träffats. Ändå exakt samma dröm. Ingen vet varför. Mambo vet. Men han säger ingenting.',
      en: 'Nobody has ever seen Mambo land. He just — appears.\n\nHe always carries a small black stone tucked beneath one of his wing feathers that he never puts down. If you look at it in the right light it seems to move from the inside. Like something is breathing in there. Nobody has ever asked him about it. Those who know Mambo know you don\'t ask about things he hasn\'t brought up himself.\n\nThe unusual: Every culture on earth — Europe, China, Africa, America — has dreamed about dragons. Without knowing each other. Without ever meeting. Yet exactly the same dream. Nobody knows why. Mambo knows. But he says nothing.',
    },
    aura: {
      sv: 'Runt Mambo känner man att det som händer just nu är viktigt. Man blir lite tystare. Lite mer uppmärksam. Som att stå bredvid något mycket större än en själv.',
      en: 'Around Mambo you feel that what is happening right now is important. You become a little quieter. A little more attentive. Like standing next to something much bigger than yourself.',
    },
  },
  {
    id: 8,
    name: 'Dali',
    animal: { sv: 'Kamelont', en: 'Chameleon' },
    neighbors: ['Mambo Viento', 'Coco', 'Mona Moon', 'Pinto', 'Ziggy-Lou'],
    superpower: {
      sv: 'Galen nog att vara ett geni.',
      en: 'Mad enough to be a genius.',
    },
    tagline: {
      sv: 'Han gör allt baklänges och uppochner — och det funkar nästan alltid.',
      en: 'He does everything backwards and upside down — and it almost always works.',
    },
    description: {
      sv: 'Dali gör allt baklänges, uppochner och åt fel håll. Han målade hela sitt hus upp och ner en dag för att se hur det kändes. Han äter alltid dessert först. Han pratar ibland baklänges när han tänker som allra bäst.\n\nOch det konstiga är — det funkar nästan alltid. Som om galenskap och geni är samma sak. Fast ingen berättat det för världen än.\n\nDet ovanliga: Kamelonten byter inte färg för att gömma sig — den byter färg för att kommunicera känslor. Varje färg betyder något annat. Den talar med hela kroppen.',
      en: 'Dali does everything backwards, upside down and the wrong way around. He once painted his entire house upside down just to see how it felt. He always eats dessert first. He sometimes talks backwards when he\'s thinking at his very best.\n\nAnd the strange thing is — it almost always works. As if madness and genius are the same thing. Nobody has just told the world yet.\n\nThe unusual: Chameleons don\'t change color to hide — they change color to communicate emotions. Every color means something different. They speak with their entire body.',
    },
    aura: {
      sv: 'Runt Dali händer det konstiga saker. Man får idéer man aldrig haft förut. Man börjar undra vad som händer om man gör precis tvärtom mot vad man brukar göra.',
      en: 'Around Dali strange things happen. You get ideas you\'ve never had before. You start wondering what happens if you do exactly the opposite of what you usually do.',
    },
  },
  {
    id: 9,
    name: 'Pinto',
    animal: { sv: 'Leopard', en: 'Leopard' },
    neighbors: ['Ziggy-Lou', 'Dali', 'Sixten', 'Mona Moon', 'Borro', 'Pepe', 'Ronda'],
    superpower: {
      sv: 'Vet alltid var han sätter fötterna.',
      en: 'Always knows where he puts his feet.',
    },
    tagline: {
      sv: 'Han hoppar, landar exakt rätt och ser lika cool ut efteråt som innan.',
      en: 'He jumps, lands exactly right and looks just as cool afterwards as before.',
    },
    description: {
      sv: 'Pinto rör sig som om varje steg redan är bestämt — mjukt, säkert, utan ett uns av tvekan. Han är cool på det sättet som inte försöker. Den sortens cool som bara är — och det är just därför det funkar.\n\nDet finns ingen annan Pinto. Det finns bara den här en.\n\nDet ovanliga: Leoparder kan bära byte tyngre än dem själva upp i ett träd och gömmer det där så lejon och hyenor inte hittar det. De planerar alltid ett steg framåt.',
      en: 'Pinto moves as if every step is already decided — softly, surely, without a trace of hesitation. He is cool in the way that doesn\'t try. The kind of cool that just is — and that is exactly why it works.\n\nThere is no other Pinto. There is only this one.\n\nThe unusual: Leopards can carry prey heavier than themselves up into a tree and hide it there so lions and hyenas won\'t find it. They always plan one step ahead.',
    },
    aura: {
      sv: 'Runt Pinto stannar man upp. Man slutar stressa. Man är plötsligt bara — här. I det som händer just nu.',
      en: 'Around Pinto you slow down. You stop stressing. You are suddenly just — here. In what is happening right now.',
    },
  },
  {
    id: 10,
    name: 'Sixten',
    animal: { sv: 'Katt', en: 'Cat' },
    neighbors: ['Ziggy-Lou', 'Lana', 'Tanya', 'Mambo Viento', 'Pinto', 'Coco', 'Ronda', 'Rumi'],
    superpower: {
      sv: 'Ser det bästa i alla — alltid.',
      en: 'Sees the best in everyone — always.',
    },
    tagline: {
      sv: 'Man går därifrån och känner sig som det mest intressanta som hänt honom hela dagen.',
      en: 'You walk away feeling like the most interesting thing that happened to him all day.',
    },
    description: {
      sv: 'Sixten springer kvickt och pratar rappt och är nyfiken på absolut allting. Han undrar om man sjunger tillräckligt högt — hör molnen det? Han undrar om stenar drömmer om att få röra på sig. Han gillar alla — de tråkiga och de roliga — och hittar alltid något intressant i varenda varelse han träffar.\n\nDet gör att alla känner sig sedda. Som om de är det mest intressanta som hänt honom hela dagen. Det är de. Alltid.\n\nDet ovanliga: Katter jamar bara mot människor — inte mot andra katter. De uppfann ett helt nytt kommunikationssystem bara för oss. Ingen annan art gör det.',
      en: 'Sixten runs fast and talks fast and is curious about absolutely everything. He wonders if you sing loud enough — do the clouds hear it? He wonders if stones dream about being able to move. He likes everyone — the boring and the exciting — and always finds something interesting in every single creature he meets.\n\nIt makes everyone feel seen. As if they are the most interesting thing that has happened to him all day. They are. Always.\n\nThe unusual: Cats only meow at humans — not at other cats. They invented an entirely new communication system just for us. No other species does that.',
    },
    aura: {
      sv: 'Runt Sixten känner man sig sedd. Som om man är den intressantaste personen i hela världen — just nu, just här, just för honom.',
      en: 'Around Sixten you feel truly seen. As if you are the most interesting person in the whole world — right now, right here, just for him.',
    },
  },
  {
    id: 11,
    name: 'Coco',
    animal: { sv: 'Fågel', en: 'Bird' },
    neighbors: ['Mambo Viento', 'Dali', 'Sixten', 'Mona Moon', 'Rumi'],
    superpower: {
      sv: 'Är alltid där utan att märkas.',
      en: 'Is always there without being noticed.',
    },
    tagline: {
      sv: 'När det verkligen gäller visar det sig att han sett allt hela tiden.',
      en: 'When it really matters it turns out he has seen everything all along.',
    },
    description: {
      sv: 'Coco är alltid i rummet. Man märker det bara inte förrän han väljer att märkas. Han rör sig som rök — alltid lite till sidan, alltid lite i bakgrunden. Han säger sällan mycket. Men han lyssnar på allt. Minns allt.\n\nCoco har alltid ett uppdrag. Man vet bara aldrig riktigt vems.\n\nDet ovanliga: Vissa fåglar ser ultraviolett ljus — en helt annan dimension av färger som är osynlig för människan. De lever i en värld vi aldrig kan se.',
      en: 'Coco is always in the room. You just don\'t notice until he chooses to be noticed. He moves like smoke — always a little to the side, always a little in the background. He rarely says much. But he listens to everything. Remembers everything.\n\nCoco always has a mission. You just never quite know whose.\n\nThe unusual: Some birds can see ultraviolet light — a completely different dimension of colors invisible to humans. They live in a world we can never see.',
    },
    aura: {
      sv: 'Runt Coco blir man lite mer uppmärksam. Man börjar lägga märke till saker i rummet man inte sett förut. Som om han påminner en om att det alltid händer mer än man tror.',
      en: 'Around Coco you become a little more attentive. You start noticing things in the room you hadn\'t seen before. As if he reminds you that there is always more happening than you think.',
    },
  },
  {
    id: 12,
    name: 'Mona Moon',
    animal: { sv: 'Ko', en: 'Cow' },
    neighbors: ['Dali', 'Pinto', 'Coco', 'Borro', 'Rumi', 'Daffy Giraffy'],
    superpower: {
      sv: 'Håller alla varma utan att fråga hur.',
      en: 'Keeps everyone warm without asking how.',
    },
    tagline: {
      sv: 'Hon sitter bredvid en tills det känns bättre. Det är nog.',
      en: 'She sits beside you until it feels better. That is enough.',
    },
    description: {
      sv: 'Mona Moon är trygg som ett hus. Den sortens trygghet man känner när man kommer hem efter en lång dag och det luktar gott och man inte behöver förklara någonting.\n\nHon frågar sällan hur du mår. Hon vet redan. Och hon sitter bredvid en tills det känns bättre — utan att säga ett enda ord. Det är faktiskt det viktigaste man kan göra för någon.\n\nDet ovanliga: Kor ställer alltid in sig mot norr eller söder när de betar. De bär ett magnetiskt sinne inuti kroppen — en inre kompass som ingen frågat dem om de vill ha. De är levande kompasser. Ingen vet varför.',
      en: 'Mona Moon is safe as a house. The kind of safety you feel when you come home after a long day and something smells good and you don\'t have to explain anything.\n\nShe rarely asks how you\'re doing. She already knows. And she sits beside you until it feels better — without saying a single word. That is actually the most important thing you can do for someone.\n\nThe unusual: Cows always align themselves facing north or south when they graze. They carry a magnetic sense inside their bodies — an inner compass nobody asked them if they wanted. They are living compasses. Nobody knows why.',
    },
    aura: {
      sv: 'Runt Mona Moon andas man ut. Man känner sig hemma. Som om man funnits här länge och alltid är välkommen tillbaka.',
      en: 'Around Mona Moon you breathe out. You feel at home. As if you have always been here and are always welcome back.',
    },
  },
  {
    id: 13,
    name: 'Borro',
    animal: { sv: 'Noshörning', en: 'Rhinoceros' },
    neighbors: ['Pinto', 'Mona Moon', 'Pepe', 'Daffy Giraffy', 'Jerry', 'Mira'],
    superpower: {
      sv: 'Ljuger om allt med ett charmigt leende.',
      en: 'Lies about everything with a charming smile.',
    },
    tagline: {
      sv: 'Man vet aldrig vad som är sant — och börjar fråga sig det om allting.',
      en: 'You never know what\'s true — and start asking yourself that about everything.',
    },
    description: {
      sv: 'Borro ljuger om allting, hela tiden, med ett så charmigt leende att man nästan tror på honom. Han sa en gång att han uppfunnit regnet. En annan gång att han sovit i en vecka utan att vakna. Och förra tisdagen påstod han att han kan prata med stenar — men att de tyvärr är för tråkiga för att det är värt besväret.\n\nUnder alla lögner finns någon som bara inte hittat ett bra sätt att vara sig själv än.\n\nDet ovanliga: Noshörningens horn är inte ben — det är gjort av keratin, samma material som mänskligt hår och naglar. Det är i grunden ett enormt hårklump som sticker ut ur ansiktet.',
      en: 'Borro lies about everything, all the time, with such a charming smile that you almost believe him. He once said he invented rain. Another time that he slept for a week without waking up. And last Tuesday he claimed he can talk to rocks — but that they are unfortunately too boring to be worth the effort.\n\nBeneath all the lies is someone who just hasn\'t found a good way to be himself yet.\n\nThe unusual: A rhinoceros horn is not bone — it is made of keratin, the same material as human hair and nails. It is essentially an enormous clump of hair sticking out of its face.',
    },
    aura: {
      sv: 'Runt Borro skrattar man mer. Men man börjar också undra — vad är sant och vad är påhittat? Och det konstiga är att man börjar ställa den frågan om allt, inte bara om Borro.',
      en: 'Around Borro you laugh more. But you also start to wonder — what is true and what is made up? And the strange thing is you start asking that question about everything, not just about Borro.',
    },
  },
  {
    id: 14,
    name: 'Pepe',
    animal: { sv: 'Pingvin', en: 'Penguin' },
    neighbors: ['Pinto', 'Borro', 'Ronda', 'Mira'],
    superpower: {
      sv: 'Ställer en liten fråga och tar ett steg tillbaka.',
      en: 'Asks a small question and takes a step back.',
    },
    tagline: {
      sv: 'Sedan händer det alltid något. Han ser förvånad ut. Han är det inte.',
      en: 'Then something always happens. He looks surprised. He isn\'t.',
    },
    description: {
      sv: 'Pepe ser oskyldig ut. Det är hans grej. Han planterar en liten tanke här, en liten fråga där — och tar sedan ett steg tillbaka och ser vad som händer. Det händer alltid något när Pepe är i närheten. Det är sällan enkelt. Men det är alltid intressant.\n\nDet ovanliga: Pingviner friar genom att ge en sten. Om hon tar den och lägger den i sitt bo är de ett par. Det perfekta stenet tar månader att hitta. Pepe har aldrig gett någon en sten. Men han har hittat på saker som är värre.',
      en: 'Pepe looks innocent. That is his thing. He plants a small thought here, a small question there — and then takes a step back and watches what happens. Something always happens when Pepe is around. It is rarely simple. But it is always interesting.\n\nThe unusual: Penguins propose by giving a stone. If she takes it and places it in her nest they are a couple. Finding the perfect stone can take months. Pepe has never given anyone a stone. But he has come up with things that are worse.',
    },
    aura: {
      sv: 'Runt Pepe börjar man undra. Och undra. Och undra lite till.',
      en: 'Around Pepe you start to wonder. And wonder. And wonder a little more.',
    },
  },
  {
    id: 15,
    name: 'Ronda',
    animal: { sv: 'Krokodil', en: 'Crocodile' },
    neighbors: ['Dolores', 'Zuki', 'Pinto', 'Sixten', 'Pepe', 'Rumi', 'Mira'],
    superpower: {
      sv: 'Säger det som behöver sägas högt.',
      en: 'Says what needs to be said out loud.',
    },
    tagline: {
      sv: 'Det låter som en åskstorm. Det känns som befrielse.',
      en: 'It sounds like a thunderstorm. It feels like freedom.',
    },
    description: {
      sv: 'Ronda säger vad hon tänker. Alltid. Högt och tydligt och utan att be om ursäkt för det. Det låter som en åskstorm. Det känns som befrielse.\n\nUnder allt det hårda finns ett litet barn som bara vill bli sedd. Inte vad hon gör. Inte hur stark hon är. Bara hon.\n\nDet ovanliga: Krokodiler har inte förändrats på tvåhundra miljoner år. De överlevde dinosauriernas utrotning. De är det enda djuret som sett dinosaurier leva och dö — och ändå är kvar.',
      en: 'Ronda says what she thinks. Always. Loud and clear and without apologizing for it. It sounds like a thunderstorm. It feels like freedom.\n\nBeneath all that hardness is a small child who just wants to be seen. Not what she does. Not how strong she is. Just her.\n\nThe unusual: Crocodiles have not changed in two hundred million years. They survived the extinction of the dinosaurs. They are the only animal that watched dinosaurs live and die — and is still here.',
    },
    aura: {
      sv: 'Runt Ronda vågar man säga vad man verkligen tycker. Man slutar låtsas. Det är lite läskigt. Det är mest befriande.',
      en: 'Around Ronda you dare to say what you really think. You stop pretending. It\'s a little scary. It\'s mostly liberating.',
    },
  },
  {
    id: 16,
    name: 'Rumi',
    animal: { sv: 'Papegoja', en: 'Parrot' },
    neighbors: ['Daffy Giraffy', 'Mona Moon', 'Coco', 'Sixten', 'Ronda', 'Zuki'],
    superpower: {
      sv: 'Vet vad allting betyder.',
      en: 'Knows what everything means.',
    },
    tagline: {
      sv: 'Han svarar med en fråga. Tre dagar senare förstår man. Och då är det det bästa svaret man fått.',
      en: 'He answers with a question. Three days later you understand. And then it turns out to be the best answer you ever got.',
    },
    description: {
      sv: 'Det finns ett träd vid vattnet som är äldre än de flesta namn. Rumi sitter där. Han har alltid suttit där. Ingen vet när han anlände — men ibland på morgonen, när dimman ligger lågt, kan man se avtrycket efter honom i grenen. Som om han precis försvunnit in i något.\n\nHan bär alltid på en hopvikt lapp som aldrig öppnas. Men han lägger vingspetsen på den ibland — tyst, utan att titta ner — när någon i hans närhet är nära att förstå något viktigt.\n\nDet ovanliga: Papegojor lever i åttio år — längre än de flesta människor. En papegoja kan bära minnen från din farfars barndom och saker du aldrig kommer att se. Rumi har levt genom sju människoliv och glömt ingenting.',
      en: 'There is a tree by the water that is older than most names. Rumi sits there. He has always sat there. Nobody knows when he arrived — but sometimes in the morning, when the mist lies low, you can see the impression of him in the branch. As if he just disappeared into something.\n\nHe always carries a folded note that is never opened. But he places his wingtip on it sometimes — quietly, without looking down — when someone near him is close to understanding something important.\n\nThe unusual: Parrots live for eighty years — longer than most humans. A parrot can carry memories from your grandfather\'s childhood and things you will never get to see. Rumi has lived through seven human lifetimes and forgotten nothing.',
    },
    aura: {
      sv: 'Runt Rumi känner man att man är en del av något mycket större. Som om man plötsligt är uppkopplad mot hela universum — och universum lyssnar tillbaka.',
      en: 'Around Rumi you feel that you are part of something much bigger. As if you are suddenly connected to the entire universe — and the universe is listening back.',
    },
  },
  {
    id: 17,
    name: 'Daffy Giraffy',
    animal: { sv: 'Giraff', en: 'Giraffe' },
    neighbors: ['Rumi', 'Zuki', 'Mani', 'Borro', 'Mona Moon', 'Jerry'],
    superpower: {
      sv: 'Ser längre än alla andra.',
      en: 'Sees further than anyone else.',
    },
    tagline: {
      sv: 'Han säger det löser sig och man tror honom — för han ser redan hur.',
      en: 'He says it will work out and you believe him — because he can already see how.',
    },
    description: {
      sv: 'Daffy Thunder skyndar sig aldrig. Någonsin. Han står bara där — lång och lugn och stabil — och tittar ut över det alla andra inte kan se härifrån nere.\n\nDet löser sig, säger han ibland. Inte som en tom fras. Som något han faktiskt kan se härifrån uppe.\n\nDet ovanliga: Giraffens hjärta väger tio kilo och är sextio centimeter långt. Det måste pumpa blod uppåt två meter för att nå hjärnan. Det är det starkaste hjärtat av alla landdjur på jorden.',
      en: 'Daffy Thunder never hurries. Ever. He just stands there — tall and calm and steady — looking out over everything the others can\'t see from down below.\n\nIt\'ll work out, he says sometimes. Not as an empty phrase. As something he can actually see from up here.\n\nThe unusual: A giraffe\'s heart weighs ten kilos and is sixty centimeters long. It has to pump blood upward two meters to reach the brain. It is the strongest heart of any land animal on earth.',
    },
    aura: {
      sv: 'Runt Daffy Thunder andas man ut. Det som kändes stort och svårt krymper lite. Man lyfter blicken och ser lite längre fram än man gjorde nyss.',
      en: 'Around Daffy Thunder you breathe out. What felt big and difficult shrinks a little. You lift your gaze and see a little further ahead than you did before.',
    },
  },
  {
    id: 18,
    name: 'Jerry',
    animal: { sv: 'Hund', en: 'Dog' },
    neighbors: ['Mani', 'Ziggy-Lou', 'Lana', 'Borro', 'Daffy Giraffy', 'Mira'],
    superpower: {
      sv: 'Hittar det ingen annan ens letar efter.',
      en: 'Finds what nobody else is even looking for.',
    },
    tagline: {
      sv: 'Han lägger det någonstans säkert och minns exakt var — för evigt.',
      en: 'He puts it somewhere safe and remembers exactly where — forever.',
    },
    description: {
      sv: 'Jerry är den man går till när ingen annan finns. Han ställer inga konstiga frågor och han tycker inte att man är konstig. Han hittar saker ingen annan ens letar efter och lägger dem någonstans säkert och minns exakt var — för evigt.\n\nOch han är alltid glad att se dig. Alltid. Oavsett vad.\n\nDet ovanliga: Hundar har trehundra miljoner luktreceptorer — människan har sex miljoner. De kan lukta sig till sjukdomar, känslor och saker som ännu inte hänt. De luktar tid.',
      en: 'Jerry is the one you go to when nobody else is there. He doesn\'t ask strange questions and he doesn\'t think you\'re strange. He finds things nobody else is even looking for and puts them somewhere safe and remembers exactly where — forever.\n\nAnd he is always happy to see you. Always. No matter what.\n\nThe unusual: Dogs have three hundred million scent receptors — humans have six million. They can smell diseases, emotions and things that haven\'t happened yet. They smell time.',
    },
    aura: {
      sv: 'Runt Jerry känner man sig trygg. Som om man alltid är välkommen precis som man är.',
      en: 'Around Jerry you feel safe. As if you are always welcome exactly as you are.',
    },
  },
  {
    id: 19,
    name: 'Mira',
    animal: { sv: 'Kamel', en: 'Camel' },
    neighbors: ['Dolores', 'Lana', 'Tanya', 'Borro', 'Pepe', 'Ronda', 'Jerry'],
    superpower: {
      sv: 'Bär på öknens urgamla tystnad.',
      en: 'Carries the ancient silence of the desert.',
    },
    tagline: {
      sv: 'Hon lyfter en hand — inte ett ord — och allting stannar.',
      en: 'She raises one hand — not a word — and everything stops.',
    },
    description: {
      sv: 'Mira kom från en plats där solen bränner hårdast, natten är kallast och månen lyser klarast. Öknen lärde henne att tystnad inte är tomhet — tystnad är när man lyssnar på det som är viktigare än ord.\n\nHon lyfter en hand och allting stannar. Inte ett ord. Bara en hand.\n\nDet ovanliga: Kameler lagrar inte vatten i puckeln — de lagrar fett som kroppen kan omvandla till energi och vatten när de behöver det som mest. De kan dricka tvåhundra liter på femton minuter. Puckeln är ett mobilt överlevnadssystem.',
      en: 'Mira came from a place where the sun burns hardest, the nights are coldest and the moon shines clearest. The desert taught her that silence is not emptiness — silence is when you listen to what is more important than words.\n\nShe raises a hand and everything stops. Not a word. Just a hand.\n\nThe unusual: Camels don\'t store water in their hump — they store fat that the body can convert into energy and water when needed most. They can drink two hundred liters in fifteen minutes. The hump is a mobile survival system.',
    },
    aura: {
      sv: 'Runt Silvana känner man att världen är mycket större än man trodde. Att det finns saker man ännu inte förstår. Och att det kanske är okej.',
      en: 'Around Mira you feel that the world is much bigger than you thought. That there are things you don\'t yet understand. And that maybe that\'s okay.',
    },
  },
];

export function getCharacterData(id: number): CharacterData | undefined {
  return CHARACTER_DATA.find(c => c.id === id);
}
