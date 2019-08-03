const Discord = require("discord.js");
const client  = new Discord.Client();
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;

require('http').createServer().listen(3000)

const BOT_VERSION = "2.0.0";
const delay = 15000;
const MAX_WEBSITES = 10;

const commandPrefix = "!";

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
var erole = "@everyone ";
var rolename = "corpwatcher";
var spamrolename = "spamreader";
var superrolename = "corpcontroller";
var adminrolename = "Admin";
var websiteswatched = [];

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
    errorchannel.send(str);
}

function isWatched(url) {
    for(var x in websiteswatched){        
        if (websiteswatched[x].url === url) {
            return true;
        }
    }
    return false;
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

client.on("guildMemberAdd", (member) => {
    welcomechannel.send("Welcome, **"+member+"**! Remember to write \"!w\" to subscribe to notifications, mute spam channels, and head over to #pawelsaskoiscool to shitpost.");
})

client.on("message", (message) => {

    if(!message.content.startsWith(commandPrefix)) return;


    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(commandPrefix.length);


    if(command === "hello"){
    
        message.channel.send("Hello is dead. You're next");
    }

    if(command === "help"){
        message.channel.send(message.author+": "+ pickone(helpfulthings));
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

    if (command === "watchwebsites") {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        websiteslist = message.content.toLowerCase().split(" ");
        websiteslist = websiteslist.splice(0, 1);

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
                                    alertchannel.send(erole+" **OH MY GOD, "+user+" MADE A POST!!**\n https://www.reddit.com/u/"+user+"/submitted");                                    
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
                                    alertchannel.send(erole+" **OH MY SWEET LORD, "+user+" COMMENTED!!**\n https://www.reddit.com/u/"+user+"/comments");
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
                                    alertchannel.send(erole+" **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! ".format(role)+website+"**");
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
                                    alertchannel.send(erole+" **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! ".format(role)+website+"**");
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


client.login(process.env.mysweettoken);
