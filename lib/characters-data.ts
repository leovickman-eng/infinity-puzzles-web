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
    neighbors: ['Zuki', 'Tarah', 'Ronda', 'Silvana'],
    superpower: {
      sv: 'Simmar mot mörkret när alla andra simmar bort.',
      en: 'Swims toward the dark when everyone else swims away.',
    },
    tagline: {
      sv: 'Hon är redan i vattnet när ni kommer fram.',
      en: 'She is already in the water when you arrive.',
    },
    description: {
      sv: 'Det var Dolores som simmade mot mörkret när alla andra simmade bort. Inte för att hon inte var rädd. Utan för att någon måste göra det och hon hade bestämt sig för att det skulle vara hon. Det var länge sedan. Hon hade aldrig ångrat sig.\n\nHon är inte den som pratar mest och hon ber aldrig om uppmärksamhet. Men hon är den som simmar mot mörkret när alla andra vänder. Och utan någon som gör det — tar man sig aldrig till andra sidan.',
      en: 'It was Dolores who swam toward the dark when everyone else swam away. Not because she wasn\'t scared. But because someone had to do it and she had decided it would be her. That was a long time ago. She had never regretted it.\n\nShe isn\'t the one who talks the most and she never asks for attention. But she is the one who swims toward the dark when everyone else turns away. And without someone who does that — you never make it to the other side.',
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
    neighbors: ['Dolores', 'Tarah', 'Mambo', 'Mani', 'Daffy Thunder', 'Rumi', 'Ronda'],
    superpower: {
      sv: 'Ser världen som om det är första gången.',
      en: 'Sees the world as if for the first time.',
    },
    tagline: {
      sv: 'Hon ställer frågan ingen annan tänkt på — och den förändrar allt.',
      en: 'She asks the question nobody else thought of — and it changes everything.',
    },
    description: {
      sv: 'Zuki var inte den starkaste eller den klokaste eller den som visste mest. Men hon ställde de bästa frågorna av alla. Och ibland är det precis vad som behövs.\n\nHon tror att hennes frågor är dumma. De är inte det. De är de bästa frågorna i hela gruppen. Hon vet bara inte om det än.',
      en: 'Zuki wasn\'t the strongest or the wisest or the one who knew the most. But she asked the best questions of anyone. And sometimes that is exactly what\'s needed.\n\nShe thinks her questions are silly. They\'re not. They are the best questions in the whole group. She just doesn\'t know it yet.',
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
    neighbors: ['Zuki', 'Ziggy-Lou', 'Mambo', 'Daffy Thunder', 'Jerry'],
    superpower: {
      sv: 'Lyssnar på det ingen annan hör.',
      en: 'Listens to what nobody else can hear.',
    },
    tagline: {
      sv: 'Hon vet svaret innan frågan är ställd.',
      en: 'She knows the answer before the question is asked.',
    },
    description: {
      sv: 'Mani visste alltid vad som var rätt. Inte för att hon var smart på det sättet som vuxna brukar mena med smart. Utan för att hon lyssnade på något inne i sig som aldrig hade fel. Alla har den rösten. Men de flesta slutar lyssna när de blir stora.\n\nHon är inte den starkaste och hon springer inte snabbast. Men när alla andra är osäkra — vet Mani. Och det är precis den sortens visshet en grupp behöver när allting känns oklart.',
      en: 'Mani always knew what was right. Not because she was clever in the way grown-ups usually mean by clever. But because she listened to something inside her that was never wrong. Everyone has that voice. Most people just stop listening when they grow up.\n\nShe isn\'t the strongest and she doesn\'t run the fastest. But when everyone else is uncertain — Mani knows. And that is exactly the kind of certainty a group needs when everything feels unclear.',
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
    neighbors: ['Mani', 'Lana Manana', 'Dali', 'Pinto', 'Sixten', 'Jerry'],
    superpower: {
      sv: 'Ser allt utan att verka se något.',
      en: 'Sees everything without seeming to see anything.',
    },
    tagline: {
      sv: 'Hon minns vad du sa för tre månader sedan och frågar om det precis när det spelar som mest roll.',
      en: 'She remembers what you said three months ago and asks about it exactly when it matters most.',
    },
    description: {
      sv: 'Ziggy-Lou hade alltid tre hemligheter. En som hon berättade för alla. En som hon berättade för ingen. Och en som hon inte ens visste om själv ännu.\n\nHon är inte den modigaste och hon är inte den som pratar högst. Men hon är den som ser mest. Och i ett sällskap som behöver hålla reda på vad som händer runt om — är det Ziggy-Lou man behöver.',
      en: 'Ziggy-Lou always had three secrets. One she told everyone. One she told nobody. And one she didn\'t even know about herself yet.\n\nShe isn\'t the bravest and she isn\'t the loudest. But she is the one who sees the most. And in a group that needs to keep track of what\'s happening around them — Ziggy-Lou is who you need.',
    },
    aura: {
      sv: 'Runt Ziggy-Lou blir man lite skarpare. Man börjar lägga märke till saker man annars missat. Som om luften blivit lite tydligare.',
      en: 'Around Ziggy-Lou you become a little sharper. You start noticing things you would otherwise have missed. As if the air has become a little clearer.',
    },
  },
  {
    id: 5,
    name: 'Lana Manana',
    animal: { sv: 'Lama', en: 'Llama' },
    neighbors: ['Ziggy-Lou', 'Tarah', 'Sixten', 'Jerry', 'Silvana'],
    superpower: {
      sv: 'Bär alltid på sanningen.',
      en: 'Always carries the truth.',
    },
    tagline: {
      sv: 'Hon säger det med ett halvt leende och tre dagar senare förstår man att hon hade rätt.',
      en: 'She says it with a half smile and three days later you realize she was right.',
    },
    description: {
      sv: 'Man visste alltid när Lana Manana kom in i ett rum. Inte för att hon var högljudd — utan för att luften förändrades lite. Som när solen kommer fram bakom ett moln men på ett värdigt sätt.\n\nHon är inte den snabbaste och hon anpassar sig inte för vem som helst. Men hon är den som alltid vet vad som är sant. Och när ingen annan vet vad man ska tro — är Lana den man litar på.',
      en: 'You always knew when Lana Manana entered a room. Not because she was loud — but because the air changed a little. Like when the sun comes out from behind a cloud but in a dignified way.\n\nShe isn\'t the fastest and she doesn\'t adapt for just anyone. But she is the one who always knows what is true. And when nobody else knows what to believe — Lana is the one you trust.',
    },
    aura: {
      sv: 'Runt Lana sitter man lite rakare. Talar lite tydligare. Man påminns om att man också kan vara sig själv — ordentligt.',
      en: 'Around Lana you sit a little straighter. Speak a little clearer. You are reminded that you too can be yourself — properly.',
    },
  },
  {
    id: 6,
    name: 'Tarah',
    animal: { sv: 'Tiger', en: 'Tiger' },
    neighbors: ['Dolores', 'Zuki', 'Lana Manana', 'Mambo', 'Sixten', 'Silvana'],
    superpower: {
      sv: 'Vet alltid vart hon ska.',
      en: 'Always knows where she\'s going.',
    },
    tagline: {
      sv: 'Hon går utan att titta tillbaka — och alla följer efter utan att förstå varför.',
      en: 'She walks without looking back — and everyone follows without understanding why.',
    },
    description: {
      sv: 'Tarah hade bestämt sig för något och nu gick hon dit. Det var precis så enkelt. Folk frågade ibland vart hon var på väg och hon svarade alltid samma sak. Dit jag ska. Och sedan var hon borta.\n\nHon är inte den varmaste och hon förklarar sig aldrig. Men hon är den som alltid vet vart hon ska. Och när gruppen är vilse — är det Tarah man följer.',
      en: 'Tarah had made up her mind about something and now she was going there. It was exactly that simple. People sometimes asked where she was heading and she always said the same thing. Where I\'m going. And then she was gone.\n\nShe isn\'t the warmest and she never explains herself. But she is the one who always knows where she\'s going. And when the group is lost — Tarah is who you follow.',
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
    neighbors: ['Zuki', 'Mani', 'Tarah', 'Dali', 'Sixten', 'Coco'],
    superpower: {
      sv: 'Reser i tiden.',
      en: 'Travels through time.',
    },
    tagline: {
      sv: 'Han vet redan hur det slutar — och ler ändå det lilla leendet när det händer.',
      en: 'He already knows how it ends — and still smiles the small smile when it does.',
    },
    description: {
      sv: 'Det fanns en drake som visste hur allting skulle sluta. Han bodde i djungeln och han hade sett saker som ingen annan hade sett, och han bar på dem ensam för det finns ingen som förstår en drake som rest igenom tiden.\n\nHan är inte den snabbaste. Han flyger knappt längre. Men han är den enda som sett hur allt hänger ihop — och ibland är det viktigare att veta vart man ska än att komma dit snabbt.',
      en: 'There was a dragon who knew how everything would end. He lived in the jungle and he had seen things nobody else had seen, and he carried them alone because there is nobody who understands a dragon who has traveled through time.\n\nHe isn\'t the fastest. He can barely fly anymore. But he is the only one who has seen how everything fits together — and sometimes knowing where you\'re going matters more than getting there quickly.',
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
    neighbors: ['Mambo', 'Coco', 'Mona Moon', 'Pinto', 'Ziggy-Lou'],
    superpower: {
      sv: 'Galen nog att vara ett geni.',
      en: 'Mad enough to be a genius.',
    },
    tagline: {
      sv: 'Han gör allt baklänges och uppochner — och det funkar nästan alltid.',
      en: 'He does everything backwards and upside down — and it almost always works.',
    },
    description: {
      sv: 'Dali gjorde allting baklänges och uppochner och åt fel håll. Och det konstiga var att det nästan alltid funkade. Han kallade det inte galenskap. Han kallade det ett annat sätt att se på saker. Och kanske hade han rätt.\n\nHan är inte den som folk lyssnar på först. Han är lite för galen för det. Men han är den som ser lösningar som ingen annan ens tänkt på — och utan honom hade gruppen fastnat länge sedan.',
      en: 'Dali did everything backwards and upside down and the wrong way around. And the strange thing was that it almost always worked. He didn\'t call it madness. He called it a different way of looking at things. And maybe he was right.\n\nHe isn\'t the one people listen to first. He\'s a little too mad for that. But he is the one who sees solutions nobody else has even thought of — and without him the group would have been stuck a long time ago.',
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
      sv: 'Pinto rörde sig som om varje steg redan var bestämt. Mjukt och säkert och utan ett uns av tvekan. Det var lite som att titta på vatten som rinner — man visste inte varför det var vackert men det var det.\n\nHan är inte den som pratar mest och han förklarar sig aldrig. Men han är den som håller sig lugn när allt är kaotiskt. Och när alla andra tappar fotfästet — är det Pinto som fortfarande vet var han sätter fötterna.',
      en: 'Pinto moved as if every step was already decided. Softly and surely and without a trace of hesitation. It was a bit like watching water flow — you didn\'t know why it was beautiful but it was.\n\nHe isn\'t the one who talks the most and he never explains himself. But he is the one who stays calm when everything is chaotic. And when everyone else loses their footing — Pinto still knows exactly where he puts his feet.',
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
    neighbors: ['Ziggy-Lou', 'Lana Manana', 'Tarah', 'Mambo', 'Pinto', 'Coco', 'Ronda', 'Rumi'],
    superpower: {
      sv: 'Ser det bästa i alla — alltid.',
      en: 'Sees the best in everyone — always.',
    },
    tagline: {
      sv: 'Man går därifrån och känner sig som det mest intressanta som hänt honom hela dagen.',
      en: 'You walk away feeling like the most interesting thing that happened to him all day.',
    },
    description: {
      sv: 'Sixten kände alla. Och han tyckte om alla. Och alla tyckte om Sixten. Det var bara det att han sprang lite för fort och pratade lite för mycket och aldrig stannade länge nog för att träffa den han aldrig hunnit lära känna. Sig själv.\n\nHan är inte den visaste och han stannar aldrig länge nog på samma ställe. Men han är den som håller ihop alla. Utan Sixten hade nitton ensamma varelser aldrig blivit ett sällskap.',
      en: 'Sixten knew everyone. And he liked everyone. And everyone liked Sixten. It was just that he ran a little too fast and talked a little too much and never stopped long enough to meet the one he had never quite got to know. Himself.\n\nHe isn\'t the wisest and he never stays in one place long enough. But he is the one who holds everyone together. Without Sixten nineteen lonely creatures would never have become a group.',
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
    neighbors: ['Mambo', 'Dali', 'Sixten', 'Mona Moon', 'Rumi'],
    superpower: {
      sv: 'Är alltid där utan att märkas.',
      en: 'Is always there without being noticed.',
    },
    tagline: {
      sv: 'När det verkligen gäller visar det sig att han sett allt hela tiden.',
      en: 'When it really matters it turns out he has seen everything all along.',
    },
    description: {
      sv: 'Man visste aldrig riktigt när Coco hade kommit in i rummet. Han var bara plötsligt där. Och när man tänkte efter hade han förmodligen alltid varit där. Man hade bara inte märkt det.\n\nHan är inte den som tar mest plats. Han tar nästan ingen plats alls. Men han är alltid där — och han vet saker ingen annan vet. Och när det verkligen gäller är det Coco som har svaret.',
      en: 'You never quite knew when Coco had come into the room. He was just suddenly there. And when you thought about it he had probably always been there. You just hadn\'t noticed.\n\nHe isn\'t the one who takes up the most space. He takes up almost none. But he is always there — and he knows things nobody else knows. And when it really matters it\'s Coco who has the answer.',
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
    neighbors: ['Dali', 'Pinto', 'Coco', 'Borro', 'Rumi', 'Daffy Thunder'],
    superpower: {
      sv: 'Håller alla varma utan att fråga hur.',
      en: 'Keeps everyone warm without asking how.',
    },
    tagline: {
      sv: 'Hon sitter bredvid en tills det känns bättre. Det är nog.',
      en: 'She sits beside you until it feels better. That is enough.',
    },
    description: {
      sv: 'Om man var ledsen gick man till Mona Moon. Hon frågade aldrig vad som var fel. Hon visste redan. Och hon fixade det inte alltid heller. Men hon satt bredvid en tills det kändes bättre. Och det räckte alltid.\n\nHon är inte den som springer snabbast eller pratar mest. Men hon är den som håller alla varma. Och utan någon som gör det — håller ingen grupp ihop länge.',
      en: 'If you were sad you went to Mona Moon. She never asked what was wrong. She already knew. And she didn\'t always fix it either. But she sat beside you until it felt better. And that was always enough.\n\nShe isn\'t the fastest runner or the biggest talker. But she is the one who keeps everyone warm. And without someone who does that — no group stays together for long.',
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
    neighbors: ['Pinto', 'Mona Moon', 'Pepe', 'Daffy Thunder', 'Jerry', 'Silvana'],
    superpower: {
      sv: 'Ljuger om allt med ett charmigt leende.',
      en: 'Lies about everything with a charming smile.',
    },
    tagline: {
      sv: 'Man vet aldrig vad som är sant — och börjar fråga sig det om allting.',
      en: 'You never know what\'s true — and start asking yourself that about everything.',
    },
    description: {
      sv: 'Borro ljög. Det visste alla. Men han ljög på ett så charmigt och vänligt och fullständigt obekymrat sätt att man nästan tyckte om honom för det. Nästan.\n\nHan ljuger för att sanningen känns för liten. Som om han inte är tillräcklig som han är. Det är hans enda riktiga hemlighet — och den enda han aldrig ljuger om.',
      en: 'Borro lied. Everyone knew it. But he lied in such a charming and friendly and completely unbothered way that you almost liked him for it. Almost.\n\nHe lies because the truth feels too small. As if he isn\'t enough as he is. That\'s his only real secret — and the only one he never lies about.',
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
    neighbors: ['Pinto', 'Borro', 'Ronda', 'Silvana'],
    superpower: {
      sv: 'Ställer en liten fråga och tar ett steg tillbaka.',
      en: 'Asks a small question and takes a step back.',
    },
    tagline: {
      sv: 'Sedan händer det alltid något. Han ser förvånad ut. Han är det inte.',
      en: 'Then something always happens. He looks surprised. He isn\'t.',
    },
    description: {
      sv: 'Pepe ställde en liten fråga. Sedan tog han ett steg tillbaka och väntade. Det hände alltid något när Pepe ställde en liten fråga. Det var sällan enkelt. Men det var alltid intressant.\n\nHan är inte den starkaste och han ser inte farlig ut. Men han är den som får saker att hända — ibland på sätt ingen förutsett. Och utan honom hade resan aldrig tagit de vändningar den behövde ta.',
      en: 'Pepe asked a small question. Then he took a step back and waited. Something always happened when Pepe asked a small question. It was rarely simple. But it was always interesting.\n\nHe isn\'t the strongest and he doesn\'t look dangerous. But he is the one who makes things happen — sometimes in ways nobody anticipated. And without him the journey would never have taken the turns it needed to take.',
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
    neighbors: ['Dolores', 'Zuki', 'Pinto', 'Sixten', 'Pepe', 'Rumi', 'Silvana'],
    superpower: {
      sv: 'Säger det som behöver sägas högt.',
      en: 'Says what needs to be said out loud.',
    },
    tagline: {
      sv: 'Det låter som en åskstorm. Det känns som befrielse.',
      en: 'It sounds like a thunderstorm. It feels like freedom.',
    },
    description: {
      sv: 'Ronda sa vad hon tyckte. Alltid. Högt och tydligt och utan att be om ursäkt för det. En del tyckte det var jobbigt. De som stannade kvar förstod att det egentligen var det snällaste man kunde göra — säga sanningen högt.\n\nHon är inte den mjukaste och folk tar ibland ett steg tillbaka när hon pratar. Men hon är den som säger det ingen annan vågar säga högt. Och utan någon som gör det — låtsas alla bara som om allting är bra.',
      en: 'Ronda said what she thought. Always. Loud and clear and without apologizing for it. Some found it difficult. Those who stayed came to understand that it was actually the kindest thing you could do — say the truth out loud.\n\nShe isn\'t the softest and people sometimes take a step back when she speaks. But she is the one who says what nobody else dares to say out loud. And without someone who does that — everyone just pretends everything is fine.',
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
    neighbors: ['Daffy Thunder', 'Mona Moon', 'Coco', 'Sixten', 'Ronda', 'Zuki'],
    superpower: {
      sv: 'Vet vad allting betyder.',
      en: 'Knows what everything means.',
    },
    tagline: {
      sv: 'Han svarar med en fråga. Tre dagar senare förstår man. Och då är det det bästa svaret man fått.',
      en: 'He answers with a question. Three days later you understand. And then it turns out to be the best answer you ever got.',
    },
    description: {
      sv: 'Rumi svarade aldrig direkt på en fråga. Han ställde alltid en fråga tillbaka. Det lät irriterande. Men tre dagar senare förstod man alltid precis vad han menat. Och då var det det bästa svaret man fått i hela sitt liv.\n\nHan är inte den som pratar mest — tvärtom. Men han är den som vet vad allting betyder. Och när alla nitton äntligen sitter ihop är det Rumi som förstår varför.',
      en: 'Rumi never answered a question directly. He always asked one back. That sounded annoying. But three days later you always understood exactly what he meant. And then it turned out to be the best answer you had ever received in your whole life.\n\nHe isn\'t the one who talks the most — quite the opposite. But he is the one who knows what everything means. And when all nineteen finally sit together it is Rumi who understands why.',
    },
    aura: {
      sv: 'Runt Rumi känner man att man är en del av något mycket större. Som om man plötsligt är uppkopplad mot hela universum — och universum lyssnar tillbaka.',
      en: 'Around Rumi you feel that you are part of something much bigger. As if you are suddenly connected to the entire universe — and the universe is listening back.',
    },
  },
  {
    id: 17,
    name: 'Daffy Thunder',
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
      sv: 'Daffy Thunder skyndade sig aldrig. Någonsin. Och det märkliga var att han alltid kom fram precis i tid. Han irriterade en del och tröstade andra och han brydde sig inte ett dugg om vad folk tyckte om det.\n\nHan skyndar sig aldrig. Inte för att han är lat — utan för att han sett tillräckligt mycket från sin höjd för att veta att det viktiga alltid väntar på en.',
      en: 'Daffy Thunder never hurried. Not ever. And the strange thing was that he always arrived just in time. That irritated some and comforted others and he didn\'t care one bit what people thought about it.\n\nHe never hurries. Not because he\'s lazy — but because he has seen enough from up high to know that what matters always waits for you.',
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
    neighbors: ['Mani', 'Ziggy-Lou', 'Lana Manana', 'Borro', 'Daffy Thunder', 'Silvana'],
    superpower: {
      sv: 'Hittar det ingen annan ens letar efter.',
      en: 'Finds what nobody else is even looking for.',
    },
    tagline: {
      sv: 'Han lägger det någonstans säkert och minns exakt var — för evigt.',
      en: 'He puts it somewhere safe and remembers exactly where — forever.',
    },
    description: {
      sv: 'Jerry hittade saker. Det var hans grej. Han förstod inte alltid vad han hittat men han lade det någonstans säkert och mindes exakt var. Om man frågade Jerry om något han hittat för tio år sedan — visste han fortfarande precis var det låg.\n\nHan är inte den smartaste och han ser lite dum ut om man inte tittar noga. Men han hittar saker ingen annan ens letar efter. Och utan Jerry hade ingen vetat att det fanns något att hitta.',
      en: 'Jerry found things. That was his thing. He didn\'t always understand what he\'d found but he put it somewhere safe and remembered exactly where. If you asked Jerry about something he found ten years ago — he still knew exactly where it was.\n\nHe isn\'t the cleverest and he looks a little silly if you don\'t look closely. But he finds things nobody else is even looking for. And without Jerry nobody would have known there was something to find.',
    },
    aura: {
      sv: 'Runt Jerry känner man sig trygg. Som om man alltid är välkommen precis som man är.',
      en: 'Around Jerry you feel safe. As if you are always welcome exactly as you are.',
    },
  },
  {
    id: 19,
    name: 'Silvana',
    animal: { sv: 'Kamel', en: 'Camel' },
    neighbors: ['Dolores', 'Lana Manana', 'Tarah', 'Borro', 'Pepe', 'Ronda', 'Jerry'],
    superpower: {
      sv: 'Bär på öknens urgamla tystnad.',
      en: 'Carries the ancient silence of the desert.',
    },
    tagline: {
      sv: 'Hon lyfter en hand — inte ett ord — och allting stannar.',
      en: 'She raises one hand — not a word — and everything stops.',
    },
    description: {
      sv: 'Silvana hade vandrat i öknen så länge att hon lärt sig något som ingen annan visste. Att tystnad inte är tomhet. Tystnad är när man lyssnar på det som är viktigare än ord.\n\nHon är inte den snabbaste och hon springer aldrig. Men hon är den som vet när man ska stanna. Och ibland är det att stanna och andas det enda som räddar allting.',
      en: 'Silvana had wandered the desert so long that she had learned something nobody else knew. That silence is not emptiness. Silence is when you listen to what is more important than words.\n\nShe isn\'t the fastest and she never runs. But she is the one who knows when to stop. And sometimes stopping and breathing is the only thing that saves everything.',
    },
    aura: {
      sv: 'Runt Silvana känner man att världen är mycket större än man trodde. Att det finns saker man ännu inte förstår. Och att det kanske är okej.',
      en: 'Around Silvana you feel that the world is much bigger than you thought. That there are things you don\'t yet understand. And that maybe that\'s okay.',
    },
  },
];

export function getCharacterData(id: number): CharacterData | undefined {
  return CHARACTER_DATA.find(c => c.id === id);
}
