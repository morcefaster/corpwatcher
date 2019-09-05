const Discord = require("discord.js");
const client  = new Discord.Client();
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;

require('http').createServer().listen(3000)

const BOT_VERSION = "2.0.0";
const delay = 15000;
const MAX_WEBSITES = 10;
const MAX_RWHOIS = 3;

const commandPrefix = "!";
const catfacts=["The heaviest cat ever recorded was 46 lbs.",
"A new contender for the world's heaviest cat. Five year old Katy, who lives in Russia reportedly weighs 20kg (44 lbs). Guinness Book of Records is no longer accepting nominations in this category as they don't want to encourage pet owners to overfeed their animals.",
"A tabby named \"Dusty\" gave birth to 420 documented kittens in her lifetime",
"A female tabby named \"Ma\" lived for 34 years, making her the oldest reliably documented housecat.",
"the oldest cat still living is a Burmese called Kataleena Lady who lives in Melbourne, Australia. Kataleena Lady was born on March 11th, 1977.",
"There are two cats commonly listed at the longest living. The first is Puss, who was born in 1903 and passed away on 29th November, 1939. The second is Granpa who lived to the ripe old age of 34. was a Sphyx adopted from the Humane Society in Texas.",
"A five year old moggy from Ontario, Canada is in the Guinness Book of Records for having a total of 27 toes.",
"On 7th August, 1970, a four year old Burmese gave birth to 19 kittens. 15 survived 1 female & 14 males)",
"A cat named Andy, holds the world record for the longest non fatal fall. Andy fell from the 16th floor (200 feet) of an apartment building.",
"A cat was discovered alive in a collapsed building 80 days after an earthquake in Taiwan in December 1999.",
"Jack & Donna Wright of Kingston, Ontario made their way to the Guinness Book of Records for having 689 cats.",
"The world's best mouser was tortoiseshell moggy Towser. From April 21st, 1963 to 20th March 1987 she caught 28,899 mice, plus numerous other unfortunate creatures such as rats & rabbits. Towser worked for the Glenturret Distillery. A statue has been erected in the distillery grounds to honour Towser.",
"A female cat named Mincho in Argentina, went up a tree and didn't come down again until she died six years later. While treed, she managed to have three litters.",
"The richest cat in the Guinness Book of World Records is a pair of cats who inherited $415,000 in the early '60s. The richest single cat is a white alley cat who inherited $250,000.",
"The tiniest cat on record was Tinker Toy from Illinois. A male Himalayan-Persian, he weighed 1 pound, 8 ounces fully grown and was 7.25\" long and 2.75\" tall! ",
"Cats can't taste sweets.",
"The cat's front paw has 5 toes, but the back paws have 4. Some cats are born with as many as 7 front toes and extra back toes (polydactl).",
"A cat has 32 muscles in each ear.",
"Neutering a cat extends it's life span by two or three years",
"A cat's tongue consists of small \"hooks,\" which come in handy when tearing up food",
"Cats must have fat in their diet because they can't produce it on their own.",
"Cat's urine glows under a black light.",
"Cats have a third eyelid called a haw and you will probably only see it when kitty isn't feeling well.",
"A cat sees about six times better than a human at night because of a layer of extra reflecting cells which absorb light.",
"Cats sleep 16 to 18 hours per day",
"Cats are the only animal that walk on their claws, not the pads of their feet.",
"Newborn kittens have closed ear canals that don't begin to open for nine days.",
"A kittens eyes are always blue at first",
"A cat cannot see directly under its nose.",
"It is a common belief that cats are color blind. However, recent studies have shown that cats can see blue, green and red",
"Cats with white fur and skin on their ears are very prone to sunburn.",
"Siamese kittens are born white.",
"A cat's jaws cannot move sideways.",
"Cats have over one hundred vocal sounds, while dogs only have about ten.",
"A cat can jump even seven times as high as it is tall.",
"A cat is pregnant for about 58-65 days.",
"A cat may have three to seven kittens every four months",
"Cats step with both left legs, then both right legs when they walk or run. The only other animals to do this are the giraffe and the camel",
"If a male cat is both orange and black it is most likely sterile",
"The color of the points in Siamese cats is heat related. Cool areas are darker",
"Cats lack a true collarbone. Because of this, a cat can generally squeeze their bodies through any space they can get their heads through.",
"There are tiny, parasitic worms that can live in a cat's stomach. These worms cause frequent vomiting.",
"A cat's brain is more similar to a man's brain than that of a dog.",
"A cat has more bones than a human; humans have 206, the cat has 230.",
"Cats have 30 vertebrae--5 more than humans have.",
"Cat have 500 skeletal muscles (humans have 650).",
"A cat can rotate its ears independently 180 degrees, and can turn in the direction of sound 10 times faster than those of the best watchdog",
"Cats' hearing is much more sensitive than humans and dogs.",
"Cats' hearing stops at 65 khz (kilohertz); humans' hearing stops at 20 khz.",
"In relation to their body size, cats have the largest eyes of any mammal.",
"A cat's field of vision is about 185 degrees.",
"Blue-eyed, white cats are often deaf.",
"A cat has a total of 24 whiskers, 4 rows of whiskers on each side. The upper two rows can move independently of the bottom two rows",
"Cats have 30 teeth (12 incisors, 10 premolars, 4 canines, and 4 molars).",
"Kittens have baby teeth, which are replaced by permanent teeth around the age of 7 months.",
"Cats purr at the same frequency as an idling diesel engine, about 26 cycles per second.",
"The typical male housecat will weigh between 7 and 9 pounds, slightly less for female housecats.",
"Cats take between 20-40 breaths per minute.",
"Normal body temperature for a cat is 102 degrees F.",
"A cat's normal pulse is 140-240 beats per minute, with an average of 195.",
"Cats lose almost as much fluid in the saliva while grooming themselves as they do through urination",
"Almost 10% of a cat's bones are in its tail.",
"the tail is used to maintain balance.",
"The domestic cat is the only species able to hold its tail vertically while walking.",
"Female felines are \"superfecund,\" which means that each of the kittens in her litter can have a different father.",
"Cat saliva contains a detergent that keeps their fur clean.",
"Cats have AB blood groups just like people",
"Cats eyes don't glow in the dark; they only reflect light.",
"Like birds, cats have a homing ability that uses its biological clock, the angle of the sun, and the Earth's magnetic field. A cat taken far from its home can return to it.",
"Cats can't taste sweets.",
"Cats born without tails genetically have a shorter spine and longer rear legs than other cats.",
"Cats eat grass to keep their digestive systems clean. The regurgitation brings up hair and other irritants.",
"Multi-colored male cats are very rare. For every 3,000 tortoiseshell or calico cats born, only one will be male",
"Cats are able to hear sounds that move faster than 45,000 hertz. They could hear the sound of a bat.",
"There are approximately 60,000 hairs per square inch on the back of a cat and about 120,000 per square inch on its underside",
"Cats only sweat from the pads of their paws; ever notice how wet the examination room table gets when you take your cat to the vet?",
"The largest cat breed is the Ragdoll. Males weigh 12-20 pounds, with females weighing 10-15 pounds.",
"The smallest cat breed is the Singapura. Males weigh about 6 pounds while females weigh about 4 pounds.",
"Cats don't see \"detail\" very well. To them, their person may appear hazy when standing in front of them.",
"Cats can see up to 120 feet away.",
"Kittens begin dreaming at just over one week old.",
"If an overweight cat's \"sides\" stick out further than her whiskers, she will lose her sense of perception and stability. Don't be surprised if she starts to squeeze into an opening that the rest of her can't fit into",
"Every cat's nose pad is unique, and no two nose prints are the same. ",
"In 1987, cats overtook dogs as the number one pet in America.",
"About 37% of American homes today have at least 1 cat.",
"It has been scientifically proven that stroking a cat can lower one's blood pressure",
"Americans spend more annually on cat food than on baby food.",
"In Asia and England, black cats are considered lucky.",
"The way you treat kittens in the early stages of it's life will render it's personality traits later in life.",
"Tylenol and chocolate are both poisionous to cats.",
"People who are allergic to cats are actually allergic to cat saliva or to cat dander. If the resident cat is bathed regularly the allergic people tolerate it better",
"The chlorine in fresh tap water irritates sensitive parts of the cat's nose. Let tap water sit for 24 hours before giving it to a cat.",
"The catnip plant contains an oil called hepetalactone which does for cats what marijuana does to some people.",
"Not every cat gets \"high\" from catnip. If the cat doesn't have a specific gene, it won't react (about 20% do not have the gene).",
"Catnip is non-addictive.",
"When well treated, a cat can live twenty or more years.",
"allergic people should tolerate spayed female cats the best",
"Cats are subject to gum disease and to dental caries. They should have their teeth cleaned by the vet or the cat dentist once a year",
"Many cats cannot properly digest cow's milk. Milk and milk products give them diarrhea",
"Cats can get tapeworms from eating mice. If your cat catches a mouse it is best to take the prize away from it.",
"If a cat is frightened, the hair stands up fairly evenly all over the body; when the cat threatens or is ready to attack, the hair stands up only in a narrow band along the spine and tail",
"Cats respond most readily to names that end in an \"ee\" sound",
"The female cat reaches sexual maturity within 6 to 10 months; most veterinarians suggest spaying the female at 5 months",
"The male cat usually reaches sexual maturity between 9 and 12 months.",
"A heat period lasts about 4 to 7 days if the female is bred; if not, the heat period lasts longer and recurs at regular intervals.",
"If a cat is frightened, put your hand over its eyes and forehead, or let him bury his head in your armpit to help calm him",
"A cat will tremble or shiver when it is in extreme pain.",
"Neutering a male cat will, in almost all cases, stop him from spraying, fighting with other males, lengthen his life and improve its quality",
"Declawing a cat is the same as cutting a human's fingers off at the knuckle.",
"The average lifespan of an outdoor-only cat (feral and non-feral) is about 3 years",
"Cats with long, lean bodies are more likely to be outgoing, and more protective and vocal than those with a stocky build.",
"A steady diet of dog food may cause blindness in your cat - it lacks taurine.",
"An estimated 50% of today's cat owners never take their cats to a veterinarian for health care.",
"Most cats adore sardines.",
"Cats respond better to women than to men, probably due to the fact that women's voices have a higher pitch",
"According to a Gallup poll, most American pet owners obtain their cats by adopting strays.",
"When your cats rubs up against you, she is actually marking you as \"hers\" with her scent.",
"Someone who is allergic to one cat may not be allergic to another cat. Though there isn't currently a way of predicting which cat is more likely to cause allergic reactions,",
"Cat bites are more likely to become infected than dog bites - but human bites are the most dangerous of all",
"Cat families usually play best in even numbers. Cats and kittens should be acquired in pairs whenever possible.",
"Don't be alarmed when your cats bring you gifts of birds, mice or other wild critters. This is a gift, and they do it to please you.",
"A smooth, shiny coat is the sign of a healthy cat.",
"If you take kitten away from its mother before it is 8 weeks old, she may not have enough time to train it to use a litter box",
"A healthy kitten has clear, bright eyes and clean ears.",
"If your cat hides and then runs out and pounces on you, she is acting out her instinctive hunting ritual.",
"Cats lick people as a sign of affection.",
"Pregnant women are advised not to come in contact with cat feces, because it can contain an organism which can affect the unborn child and even cause miscarriage.",
"Most lively, active kittens grow up to be friendly, outgoing cats.",
"A healthy cat's nose is cool.",
"When a cat swishes its tail back and forth, she's concentrating on somthing; if her tail starts moving faster, she has become annoyed.",
"Only a mother cat should pick a cat up by the scruff of the neck.",
"Brushing your cat daily will cut down on hairballs.",
"If you do not respond when your cat talks to you, it will soon lose the urge to communicate with you.",
"Some cats, males in particular, develop health problems if fed dry food exclusively.",
"A little vegetable oil daily will help to prevent fur-balls and bring a shine to your cat's coat.",
"It has been scientifically proven that owning cats is good for our health and can decrease the occurrence of high blood pressure and other illnesses.",
"Stroking a cat can help to relieve stress, and the feel of a purring cat on your lap conveys a strong sense of security and comfort.",
"In multi-cat households, cats of the opposite sex usually get along better.",
"25% of cat owners blow dry their cats hair after a bath.",
"If your cat is near you, and her tail is quivering, this is the greatest expression of love your cat can give you.",
"People who own pets live longer, have less stress, and have fewer heart attacks.",
"\"Sociable\" cats will follow you from room to room to monitor your activities throughout the day.",
"The more cats are spoken to, the more they will speak to you.",
"Most cats prefer their food at room temperature",
"95% of all cat owners admit they talk to their cats.",
"If you can't feel your cat's ribs, she's too heavy.",
"A cat that bites you after you have rubbed his stomach, is probably biting out of pleasure, not anger.",
"Expect to spend an average of $80 per year on vet bills, for the lifetime of each cat you own.",
"It costs $7000 to care for one household cat over its lifetime. This covers only the necessities; the pampered pet will carry a higher price.",
"To make sure your cat's collar fits properly, make sure you can slip two fingers under the collar, between the collar and your cat's neck. ",
"Cats lived with soldiers in trenches, where they killed mice during World War I.",
"Napoleon was terrified of cats.",
"Abraham Lincoln loved cats. He had four of them while he lived in the White House.",
"The ancestor of all domestic cats is the African Wild Cat which still exists today",
"In ancient Egypt, killing a cat was a crime punishable by death",
"In ancient Egypt, mummies were made of cats, and embalmed mice were placed with them in their tombs. In one ancient city, over 300,000 cat mummies were found.",
"In the Middle Ages, during the Festival of Saint John, cats were burned alive in town squares.",
"In ancient Egypt, entire families would shave their eyebrows as a sign of mourning when the family cat died.",
"The cat family split from the other mammals at least 40,000,000 years ago, making them one of the oldest mammalian families.",
"Phoenician cargo ships are thought to have brought the first domesticated cats to Europe in about 900 BC",
"Cats have been domesticated for half as long as dogs have been.",
"The Pilgrims were the first to introduce cats to North America.",
"The first breeding pair of Siamese cats arrived in England in 1884.",
"The first formal cat show was held in England in 1871; in America, in 1895.",
"The Maine Coon cat is America's only natural breed of domestic feline.",
"The life expectancy of cats has nearly doubled since 1930 - from 8 to 16 years.",
"Cat litter was \"invented\" in 1947 when Edward Lowe asked his neighbor to try a dried, granulated clay used to sop up grease spills in factories.",
"Genetic mutation created the domestic cat which is tame from birth.",
"Among other tasks, cats can be taught to use a toilet, come, sit, beg, heel, jump through a hoop, play dead, roll over, open a door, shake, fetch and more",
"A cat will not eat its food if is unable to smell it.",
"Sir Isaac Newton is not only credited with the laws of gravity but is also credited with inventing the cat flap.",
"There have been three different cats who have played the famed \"Morris the Cat.\" The first Morris was adopted from a shelter in 1968. In 1969 he landed the role of Morris the Cat in the famous 9 Lives Cat Food commercials...and was an overnight success! The first Morris died in 1978 and was subsequently replaced by two more cats who played \"Morris.\" All three of the \"Morris the Cat\" cats were rescued from shelters.",
"34% of cat-owning households have incomes of $60,000 or more.",
"32% of those who own their own home, also own at least one cat. ",
"If your cat rolls over on his back to expose his belly, it means he trusts you.",
"Cats purr to communicate. Purring does not always mean happiness.",
"Mother cats teach their kittens to use the litter box.",
"Contrary to popular belief, the cat is a social animal.",
"Some cats will actually knead and drool when they are petted. The kneading or marching means that the cat is happy",
"Unlike humans and dogs, cats do not suffer a lot from loneliness. They are far more concerned with territorial issues.",
"A cat will spend nearly 30% of her life grooming herself.",
"Cats bury their feces to cover their trails from predators.",
"Hunting is not instinctive for cats. Kittens born to non-hunting mothers may never learn to hunt.",
"Cats are attracted to the cave-like appeal of a clothes dryer.",
"A cat will kill it's prey based on movement, but may not necessarily recognize that prey as food. Realizing that prey is food is a learned behavior. ",
"A group of kittens is called a kindle",
"A group of adult cats is called a clowder",
"When a domestic cat goes after mice, about one pounce in three results in a catch.",
"The cheetah is the only cat in the world that can't retract it's claws.",
"Studies show that if a cat falls off the seventh floor of a building it is 30% less likely to survive than a cat that falls off the twentieth floor. It supposedly takes about eight floors for the cat to realize what is occurring, relax and correct itself.",
"A large majority of white cats with blue eyes are deaf. White cats with only one blue eye are deaf only in the ear closest to the blue eye. White cats with orange eyes do not have this disability.",
"Today there are about 100 distinct breeds of the domestic cat.",
"All cats are members of the family Felidea",
"A domestic cat can sprint at about 31 miles per hour",
"The catgut formerly used as strings in tennis rackets and musical instruments does not come from cats. Catgut actually comes from sheep, hogs, and horses",
"Most deaf cats do not meow.",
"In England, the government owns thousands of cats. Their job is to help keep the buildings free of rodents.",
"Australia and Antarctica are the only continents which have no native cat species.",
"Ailurophile is the word cat lovers are officially called.",
"Calico cats are almost always female.",
"A falling cat will always right itself in a precise order. First the head will rotate, then the spine will twist and the rear legs will align, then the cat will arch its back to lessen the impact of the landing.",
"The most popular names for female cats in the U.S. are Missy, Misty, Muffin, Patches, Fluffy, Tabitha, Tigger, Pumpkin and Samantha.",
"In English, cat is \"cat.\" In French, cat is \"Chat.\" In German, your cat is \"katze.\" The Spanish word for cat is \"gato,\" and the Italian word is \"gatto.\" Japanese prefer \"neko\" and Arabic countries call a cat a \"kitte.\"",
"It is believed that a white cat sitting on your doorstep just before your wedding is a sign of lasting happiness.",
"Cats are more active during the evening hours.",
"According to myth, a cat sleeping with all four paws tucked under means cold weather is coming.",
"Hebrew folklore believes that cats came about because Noah was afraid that rats might eat all the food on the ark. He prayed to God for help. God responded by making the lion sneeze a giant sneeze -- and out came a little cat!"];
const helpfulthings = ["Have you tried checking the background image?", 
"Perhaps you should upvote /u/corpthing.", 
"Maybe silence.mp3 has something to do with it?", 
"Did anyone try contacting that cool Paweł Sasko dude?", 
"What if you gather all sounds together and play them backwards?",
"Are you *sure* you checked the background image?",
"The robotic fish are hiding something."]
const howtocallme = ["master", "my flesh-bearing eminence", "your majesty", "your highness", "your greatness", "o' great hero", "o' great hero, defeater of corporations, eater of sausages", "o' great hero, ruler of corporations, preorderer of Cyberpunk 2077", "though I'm not doing it for your sake, baka"];
var role;
var spamrole;
var checkredditposts = 0;
var checkredditcomments = 0;
var checkwebsite = 0;
var erole = "@everyone";
var rolename = "corpwatcher";
var spamrolename = "spamreader";
var superrolename = "corpcontroller";
var adminrolename = "Admin";
var websiteswatched = [];
var whoiswatched = [];
var whoisdelay = 3600000;

var spamchannel;
var errorchannel;
var alertchannel;
var welcomechannel;

var currentposts = 0;
var currentcomments = 0;
var watcheduser = "";
var watchedwebsite = "";
var firstrunc=0;
var firstrunp=0;
var firstrunw=0;

var latesthappenings = "";
var errors = 0;
var lasterror = 0;

var spamtriggercomments = 0;
var spamtriggerposts = 0;
var spamtriggerwebsite = 0;

var spamcount = 3;


function got_error(str) {
    console.log(str);
    errorchannel.send("Had an error: "+str);
}

function isWatched(url) {
    for(var x in websiteswatched){        
        if (websiteswatched[x].url === url) {
            return true;
        }
    }
    return false;
}

function isWhoisWatched(url) {
    for(var x in whoiswatched){        
        if (whoiswatched[x].url === url) {
            return true;
        }
    }
    return false;
}

function watchWhois(url) {
    whoiswatched.push({
        url: url,
        firstrun: 0,
        content: null
    });
}

function getWhoisContent(url) {
    for(var i in whoiswatched){
        if (whoiswatched[i].url === url) {
            return whoiswatched[i].content;
        }
    }
    got_error("Could not find whois "+url+" (get content)");   
}

function setWhoisContent(url, content){
    for(var i in whoiswatched){
        if (whoiswatched[i].url === url) {
            whoiswatched[i].content = content;
            return;
        }
    }
    got_error("Could not find whois "+url+" (set content)");
}


function watchWebsite(url) {
    websiteswatched.push( { 
        url: url,
        firstrun: 0,
        content: null,
        spamtrigger: 0
    });
}

function shouldSpam(url) {
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            websiteswatched[i].spamtrigger = (websiteswatched[i].spamtrigger +1 ) % spamcount;
            return websiteswatched[i].spamtrigger === 1;
        }
    }
    got_error("Could not find website "+url+" (shouldSpam)");
}

function getContent(url) {
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            return websiteswatched[i].content;
        }
    }
    got_error("Could not find website "+url+" (get content)");    
}



// what documentation?

function setContent(url, content){
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            websiteswatched[i].content = content;
            return;
        }
    }
    got_error("Could not find website "+url+" (set content)");
}

function isFirstWhoisRun(url) {
    for(var i in whoiswatched){
        if (whoiswatched[i].url === url) {
            return whoiswatched[i].firstrun;
        }
    }
    got_error("Could not find whois "+url+" (isFirstWhoisRun)");
}

function firstWhoisRun(url) {    
    for(var i in whoiswatched){
        if (whoiswatched[i].url === url) {
            whoiswatched[i].firstrun=1;
            return;
        }
    }
    got_error("Could not find whois "+url+" (firstWhoisRun)");
}

function isFirstRun(url) {
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            return websiteswatched[i].firstrun;
        }
    }
    got_error("Could not find website "+url+" (isFirstRun)");
}

function firstRun(url) {    
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            websiteswatched[i].firstrun=1;
            return;
        }
    }
    got_error("Could not find website "+url+" (firstRun)");
}

function removeSite(url) {
    for(var i in websiteswatched){
        if (websiteswatched[i].url === url) {
            websiteswatched.splice(i, 1);
            return;
        }
    }
    got_error("Could not find website "+url+" (removeSite)");
}


function removeWhois(url) {
    for(var i in whoiswatched){
        if (whoiswatched[i].url === url) {
            whoiswatched.splice(i, 1);
            return;
        }
    }
    got_error("Could not find whois "+url+" (removeWhois)");
}


function firstrunreddit() {
    firstrunc = 0;
    firstrunp = 0;
}

function firstrunwebsite(url) {
    websiteswatched_fr.find()
}

function pickone(list) {
    let i = list.length;
    return list[getRandomInt(i)];
}

// This is a function which will be called when the bot is ready.
client.on("ready", () => {
    console.log("Bot started! Version " + BOT_VERSION);
    const guild = client.guilds.get("602463551134892053");
    console.log("guild is "+guild);
    role = guild.roles.find(r => r.name === rolename);
    console.log("role is "+role);  
    spamrole = guild.roles.find(r=> r.name === spamrolename);
    spamchannel = guild.channels.find(r=>r.name === "shamelessspam");
    errorchannel = guild.channels.find(r=>r.name === "errors");
    alertchannel = guild.channels.find(r=>r.name === "argalert");
    welcomechannel = guild.channels.find(r=>r.name === "welcome");
});

function replaceat(str, cutStart, cutEnd, newStr){
  return str.substr(0,cutStart) + newStr + str.substr(cutEnd+1);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

client.on("guildMemberAdd", (member) => {
    welcomechannel.send("Welcome, **"+member+"**! Write \"!w\" to subscribe to website change notifications, check #about, make sure to mute spam channels, and head over to #pawelsaskoiscool to shitpost.");
})

client.on("message", (message) => {
    if(!message.content.startsWith(commandPrefix)) {
        if (!message.content.toLowerCase().includes("pawel sasko")) {
            return;
        }
        var newmessage = message.content;

        while (newmessage.toLowerCase().includes("pawel sasko")) {
            var n = newmessage.toLowerCase().lastIndexOf("pawel sasko");
            newmessage = replaceat(newmessage,n,n+"pawel sasko".length - 1, "Paweł Sasko (that really cool dude)");            
        }
        newmessage = "What this law-abiding citizen meant to write was:\n"+message.author+": "+newmessage;
        message.delete();
        message.channel.send(newmessage);
    };


    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(commandPrefix.length);


    if(command === "hello"){
    
        message.channel.send("Hello is dead. You're next");
    }

    if(command === "help"){
        message.channel.send(message.author+": "+ pickone(helpfulthings));
    }

    if (command === "catfact") {
        message.channel.send(message.author+": "+pickone(catfacts));
    }

    if (command ==="watchreddit") 
    {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        if (checkredditposts || checkredditcomments) {
            message.channel.send(message.author+": I'm already watching user \""+watcheduser+"\" and I'm too stupid to watch more than one. Complain to Morce.");
            return;
        }        

        watcheduser = message.content.toLowerCase().split(" ");
        if (watcheduser.length === 1) {
            message.channel.send(message.author + " who the fuck am I supposed to watch?");
            return;
        }
        if (watcheduser.length > 2) {
            message.channel.send(message.author + " which one of those fucks am I supposed to watch?");
            return;
        }
        watcheduser = watcheduser[1];
        checkredditcomments = 1;
        checkredditposts = 1;
        firstrunreddit();
        watchposts(watcheduser);
        watchcomments(watcheduser);
        message.channel.send("As you wish, "+pickone(howtocallme)+".");
    }

    if (command === "watchreversewhois") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;            
        }

        whoislist = message.content.toLowerCase().split(" ");
        whoislist.splice(0, 1);

        if (whoiswatched.length + whoiswatched.length > MAX_RWHOIS) {
            message.channel.send(message.author+": So many whois websites won't fit, onii-chan! I'm already watching "+whoiswatched.length+", Max: " + MAX_RWHOIS);
            return;
        }

        var bigreply = message.author+": ";

        if (whoislist.length === 0) {
            bigreply += "Please specify the fucking whois url, baka.";
        } else {
            whoislist.forEach( (whoisurl) => {
                if (isWhoisWatched(whoisurl)){
                    bigreply+= "I'm already watching "+whoisurl+", baka.\n";
                    return;
                }
                if (whoisurl.startsWith("https://")) {
                    watchWhois(whoisurl);
                    watchwhoishttps(whoisurl);
                } else if (whoisurl.startsWith("http://")) {
                    bigreply+="I don't support fucking http for ["+whoisurl+"], baka";
                } else {
                    bigreply+="Please specify the fucking protocol for ["+whoisurl+"], baka.\n";
                    return;
                }
                bigreply+="Now watching whois "+whoisurl+"\n";
            });
        }
        message.channel.send(bigreply);
    }

    if (command ==="stopwatchingwhois") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }        

        whoisurl = message.content.toLowerCase().split(" ");
        if (whoisurl.length === 1) {
            message.channel.send(message.author + " what fucking whois?");
            return;
        }
        if (whoisurl.length > 2) {            
            message.channel.send(message.author + " which fucking whois?");
            return;
        }
        whoisurl = whoisurl[1];
        if (!isWhoisWatched(whoisurl)){
            message.channel.send(message.author + ": I-I'm not even watching that!");
            return;
        }        

        removeWhois(whoisurl);
        message.channel.send("As you wish, "+pickone(howtocallme)+".");
    }



    if (command === "watchwebsites") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        websiteslist = message.content.toLowerCase().split(" ");
        websiteslist.splice(0, 1);

        if (websiteswatched.length + websiteslist.length > MAX_WEBSITES) {
            message.channel.send(message.author+": So many websites won't fit, onii-chan! I'm already watching "+websiteswatched.length+", Max: " + MAX_WEBSITES);
            return;
        }

        var bigreply = message.author+": ";

        if (websiteslist.length === 0) {
            bigreply += "Please specify the fucking websites, baka.";
        } else {
            websiteslist.forEach( (websiteurl) => {
                if (isWatched(websiteurl)){
                    bigreply+= "I'm already watching "+websiteurl+", baka.\n";
                    return;
                }
                if (websiteurl.startsWith("https://")) {
                    watchWebsite(websiteurl);
                    watchwebsitehttps(websiteurl);
                } else if (websiteurl.startsWith("http://")) {
                    watchWebsite(websiteurl);
                    watchwebsitehttp(websiteurl);
                } else {
                    bigreply+="Please specify the fucking protocol for ["+websiteurl+"], baka.\n";
                    return;
                }
                bigreply+="Now watching "+websiteurl+"\n";
            });
        }
        message.channel.send(bigreply);
    }

    if (command ==="watchwebsite") 
    {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        if (websiteswatched.length > MAX_WEBSITES) {
            message.channel.send(message.author+": So many websites won't fit, onii-chan! Max: " + MAX_WEBSITES);
            return;
        }

        websiteurl = message.content.toLowerCase().split(" ");
        if (websiteurl.length === 1) {
            message.channel.send(message.author + ": what fucking website?");
            return;
        }
        if (websiteurl.length > 2) {            
            message.channel.send(message.author + ": which fucking website?");
            return;
        }
        websiteurl = websiteurl[1];
        
        if (isWatched(websiteurl)){
            message.channel.send(message.author + ": I'm already watching that website, baka.");
            return;
        }

        if (websiteurl.startsWith("https://")) {
            watchWebsite(websiteurl);
            watchwebsitehttps(websiteurl);
        } else if (websiteurl.startsWith("http://")) {
            watchWebsite(websiteurl);
            watchwebsitehttp(websiteurl);
        } else {
            message.channel.send(message.author+": Please include the fucking protocol.");
            return;
        }
        message.channel.send("As you wish, "+pickone(howtocallme)+".");
    }

    if (command ==="stopwatchingwebsite") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }        

        websiteurl = message.content.toLowerCase().split(" ");
        if (websiteurl.length === 1) {
            message.channel.send(message.author + " what fucking website?");
            return;
        }
        if (websiteurl.length > 2) {            
            message.channel.send(message.author + " which fucking website?");
            return;
        }
        websiteurl = websiteurl[1];
        if (!isWatched(websiteurl)){
            message.channel.send(message.author + ": I-I'm not even watching that!");
            return;
        }        

        removeSite(websiteurl);
        message.channel.send("As you wish, "+pickone(howtocallme)+".");
    }

    if (command ==="stopwatchingreddit") 
    {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        if (!checkredditposts && !checkredditcomments) {
            message.channel.send("I-I'm not doing that, "+message.author+"!");
            return;
        }

        checkredditcomments = 0;
        checkredditposts = 0;

        watcheduser = "";        
        message.channel.send("As you wish, "+pickone(howtocallme)+".");
    }

    if (command ==="areyouok") {
        let now = Date.now();
        timebetween = now - lasterror;
        if (timebetween > 60*1000*30) {
            message.channel.send(message.author+": I'm quite fine, thank you. Last error was "+ (lasterror?(((Date.now()-lasterror)/60000)+" minutes ago."):"never." ) +" Errors so far: "+errors);
        } else {
            message.channel.send(message.author+": Seems that I've ran into some issues in the last 30 minutes. Total errors: "+errors);
        }
    }

    if (command ==="testsetposts") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }
        currentposts = parseInt(message.content.toLowerCase().split(" ")[1]);
    }

     if (command ==="testmentionrole") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }
        var gld = client.guilds.get("602463551134892053");
        testrolemnt =  message.content.toLowerCase().split(" ")[1];
        var mentrole = gld.roles.find(r => r.name === testrolemnt);       
        message.channel.send("ok, mentioning "+mentrole);
    }

    if (command ==="testsetcomments") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }
        currentcomments = parseInt(message.content.toLowerCase().split(" ")[1]);
    }

    if (command ==="listwebsites") {      
        var mes = message.author+": Currently I'm watching "+websiteswatched.length+" websites.";        
        for(var i in websiteswatched) {
            num = parseInt(i) + 1;
            mes += "\n"+num+": ["+websiteswatched[i].url+"]";
        }
        message.channel.send(mes);

    }

    if (command ==="listwhois") {      
        var mes = message.author+": Currently I'm watching "+websiteswatched.length+" whois-es.";        
        for(var i in whoiswatched) {
            num = parseInt(i) + 1;
            mes += "\n"+num+": ["+whoiswatched[i].url+"]";
        }
        message.channel.send(mes);

    }

    if (command ==="testsetwebsite") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }        
        if (message.content.toLowerCase().split(" ").length > 1) {
            setContent(message.content.toLowerCase().split(" ")[1], message.content.toLowerCase().split(" ")[2]);
            message.channel.send("As you wish, "+pickone(howtocallme)+".");
        } else {
            message.channel.send("Are you retarded, sir?");
        }
    }

    if (command ==="iwannawatchtoo" || command === "w") {
        if (message.member.roles.find(r=>r.name === rolename)) {
            message.channel.send(message.author+": you're already on the list, you silly goose.");
            return;
        }
        message.member.addRole(role).catch(console.error);
        message.channel.send(message.author+": Cheeki-breeki! You are now a stalker.");
    }

    if (command ==="idontwannawatchanymore" || command==="nw") {
        if (!message.member.roles.find(r=>r.name === rolename)) {
            message.channel.send(message.author+": you're not watching anything, you donut.");
            return;
        }
        message.member.removeRole(role).catch(console.error);
        message.channel.send(message.author+": Congratulations! You are no longer a stalker. What a bore.");
    }

    if (command ==="iwannareadspam" || command === "wrs") {
        if (message.member.roles.find(r=>r.name === spamrolename)) {
            message.channel.send(message.author+": then go for it, dummy. What do you need me for?");
            return;
        }
        message.member.addRole(spamrole).catch(console.error);
        message.channel.send(message.author+": Congratulations(?) You can now read spam.");
    }

    if (command ==="idontwannareadspam" || command==="nwrs") {
        if (!message.member.roles.find(r=>r.name === spamrolename)) {
            message.channel.send(message.author+": then don't. Why bother me? I'm busy spamming.");
            return;
        }
        message.member.removeRole(spamrole).catch(console.error);
        message.channel.send(message.author+": Congratulations! You are now spam-free.");
    }
});


function watchposts(user) {
    if (checkredditposts){
        setTimeout( () => {                
            if (checkredditposts){           
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }  
                https.get('https://www.reddit.com/user/'+user+"/submitted.json", options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{            
                        try {                        
                            let obj = JSON.parse(data);
                            let posts = obj["data"]["children"].length;
                            spamtriggerposts = (spamtriggerposts+1) % spamcount;
                            if (spamtriggerposts === 1) {
                                spamchannel.send("User "+user+" has "+posts+" posts. " + (firstrunp?(posts!==currentposts?" (**changed!!**)":"(unchanged)"):"(first run)"));
                            }
                            if (posts!==currentposts) {
                                if (firstrunp){
                                    alertchannel.send(erole+" , "+role+"  **OH MY GOD, "+user+" MADE A POST!!**\n https://www.reddit.com/u/"+user+"/submitted");                                    
                                }
                                currentposts=posts;
                            }
                            firstrunp = 1;
                        } catch (ex) {
                            got_error(ex);
                        }


                    })
                    
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting "+user+"'s posts: "+e.message+" (code "+e.http_code+")");
                })
                watchposts(user);
            }
        }, delay);
    }
}


function watchcomments(user) {
    if (checkredditcomments){
        setTimeout( () => {     
            if (checkredditcomments){ 
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }                      
                https.get('https://www.reddit.com/user/'+user+"/comments.json", options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{ 
                        try{                       
                            let obj = JSON.parse(data);
                            let comments = obj["data"]["children"].length;
                            spamtriggercomments = (spamtriggercomments+1) % spamcount;
                            if (spamtriggercomments === 1) {
                                spamchannel.send("User "+user+" has "+comments+" comments. " + (firstrunc?(comments!==currentcomments?" (**changed!!**)":"(unchanged)"):"(first run)"));
                            }
                            if (comments!==currentcomments) {
                                if (firstrunc){
                                    alertchannel.send(erole+" , "+role+" **OH MY SWEET LORD, "+user+" COMMENTED!!**\n https://www.reddit.com/u/"+user+"/comments");
                                }
                                currentcomments=comments;
                            }
                            firstrunc = 1;

                        } catch (ex) {
                            got_error(ex);
                        }
                    })
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting "+user+"'s comments: "+e.message+" (code "+e.http_code+")");
                })
                watchcomments(user);
            }
        }, delay);

    }
}

function watchwebsitehttps(website) {
    if (isWatched(website)){
        setTimeout( () => {     
            if (isWatched(website)){
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }                  
                https.get(website, options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{
                        try{ 
                            websitehtml = data;                            
                            if (shouldSpam(website)) {
                                spamchannel.send("Website "+website+" has "+data.length+" characters. " + (isFirstRun(website)?(getContent(website)!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"(first run)"));                                
                            }
                            if (websitehtml!==getContent(website)) {
                                if (isFirstRun(website)) {
                                    spamchannel.send("New site content: \n ========= \n "+websitehtml+"\n =========");
                                    alertchannel.send(erole+" , "+role+" **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! "+website+"**");
                                }
                                setContent(website, websitehtml);
                            }    
                            firstRun(website);
                        } catch (ex) {                            
                            got_error("Had an issue: "+ex);
                        }
                    })
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting website "+website+": "+e.message+" (code "+e.http_code+")");
                })
                watchwebsitehttps(website);
            }
        }, delay);
    }
}

function watchwebsitehttp(website) {
    if (isWatched(website)){
        setTimeout( () => {     
            if (isWatched(website)){
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }                  
                http.get(website, options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{
                        try{ 
                            websitehtml = data;                            
                            if (shouldSpam(website)) {
                                spamchannel.send("Website "+website+" has "+data.length+" characters. " + (isFirstRun(website)?(getContent(website)!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"(first run)"));
                            }
                            if (websitehtml!==getContent(website)) {
                                if (isFirstRun(website)) {
                                    spamchannel.send("New site content: \n ========= \n "+websitehtml+"\n =========");
                                    alertchannel.send(erole+" , "+role+" **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! "+website+"**");
                                }
                                setContent(website, websitehtml);
                            }    
                            firstRun(website);
                        } catch (ex) {                            
                            got_error("Had an issue: "+ex);
                        }
                    })
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting website "+website+": "+e.message+" (code "+e.http_code+")");
                })
                watchwebsitehttp(website);
            }
        }, delay);
    }
}

function watchwhoishttps(website) {
    if (isWhoisWatched(website)){
        if (!isFirstWhoisRun(website)) {
                let options = {                    
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36' }
                }                  
                https.get(website, options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{
                        try{ 
                            websitehtml = data;                            
                            var domainPos = websitehtml.indexOf(" domains that matched this search query.");
                            var domainCount = -1;
                            errorchannel.send(websitehtml.substring(0, 1000));
                            console.log(websitehtml);
                            console.log(domainPos);

                            if (domainPos !== -1) {
                                var count = websitehtml.substring(domainPos-2, 2);
                                console.log(websitehtml.substring(domainPos-2, 2));
                                domainCount = parseInt(count);
                            }                            
                            spamchannel.send("Whois result from "+website+": "+(domainCount === -1 ? "[error]": (domainCount + " domains registered. " + (isFirstWhoisRun(website)?(getWhoisContent(website)!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"(first run)"))));                            
                            if (websitehtml!==getWhoisContent(website)) {
                                if (isFirstWhoisRun(website)) {
                                    spamchannel.send("New site content at "+website+": \n ========= \n "+websitehtml+"\n =========");
                                    alertchannel.send(erole+" , "+role+" **What in the blazes, domain registrations have changed!! "+website+"**");
                                }
                                setWhoisContent(website, websitehtml);
                            }    
                            firstWhoisRun(website);
                        } catch (ex) {                            
                            got_error("Had an issue getting whois: "+ex);
                        }
                    })
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting website "+website+": "+e.message+" (code "+e.http_code+")");
                })
                watchwebsitehttp(website);
            };

        setTimeout( () => {     
            if (isWhoisWatched(website)){
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }                  
                https.get(website, options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{
                        try{ 
                            websitehtml = data;                            
                            var domainPos = websitehtml.indexOf(" domains that matched this search query.");
                            var domainCount = -1;
                            if (domainPos !== -1) {
                                var count = websitehtml.substring(domainPos-2, 2);
                                domainCount = parseInt(count);
                            }                            
                            spamchannel.send("Whois result from "+website+": "+(domainCount === -1 ? "[error]": (domainCount + " domains registered. " + (isFirstWhoisRun(website)?(getWhoisContent(website)!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"(first run)"))));                            
                            if (websitehtml!==getWhoisContent(website)) {
                                if (isFirstWhoisRun(website)) {
                                    spamchannel.send("New site content at "+website+": \n ========= \n "+websitehtml+"\n =========");
                                    alertchannel.send(erole+" , "+role+" **What in the blazes, domain registrations have changed!! "+website+"**");
                                }
                                setWhoisContent(website, websitehtml);
                            }    
                            firstWhoisRun(website);
                        } catch (ex) {                            
                            got_error("Had an issue getting whois: "+ex);
                        }
                    })
                }).on('error', (e) => {                    
                    errors++;
                    lasterror = Date.now();
                    got_error("Had an issue getting website "+website+": "+e.message+" (code "+e.http_code+")");
                })
                watchwebsitehttp(website);
            }
        }, whoisdelay);
    }
}


client.login(process.env.mysweettoken);



