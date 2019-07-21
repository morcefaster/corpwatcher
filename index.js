const Discord = require("discord.js");
const client  = new Discord.Client();
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;

require('http').createServer().listen(3000)

const BOT_VERSION = "1.0.0";
const delay = 15000;

// Here you find the prefix for all commands.
// For example: When it is set to "!" then you can execute commands with "!" like "!help"
//              or if you set it to "_" then you can execute commands like "_help".
const commandPrefix = "!";

const helpfulthings = ["Have you tried checking the background image?", 
"Perhaps you should upvote /u/corpthing.", 
"Maybe silence.mp3 has something to do with it?", 
"Did anyone try contacting that cool Paweł Sasko dude?", 
"What if you gather all sounds together and play them backwards?",
"Are you *sure* you checked the background image?",
"The robotic fish are hiding something."]
const howtocallme = ["master", "my flesh-bearing eminence", "your majesty", "your highness", "your greatness", "o' great hero", "o' great hero, defeater of corporations, eater of sausages", "o' great hero, ruler of corporations, preorderer of Cyberpunk 2077"];
var role;
var checkredditposts = 0;
var checkredditcomments = 0;
var checkwebsite = 0;
var rolename = "corpwatcher";
var superrolename = "corpcontroller";
var adminrolename = "Admin";

var spamchannel;
var errorchannel;
var alertchannel;

var currentposts = 0;
var currentcomments = 0;
var currentwebsite = "";
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


function firstrunreddit() {
    firstrunc = 0;
    firstrunp = 0;
}

function firstrunwebsite() {
    firstrunw = 0;
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
    spamchannel = guild.channels.find(r=>r.name === "shamelessspam");
    errorchannel = guild.channels.find(r=>r.name === "errors");
    alertchannel = guild.channels.find(r=>r.name === "argalert");
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

client.on("message", (message) => {

    // It will do nothing when the message doesnt start with the prefix
    if(!message.content.startsWith(commandPrefix)) return;


    // This cuts out the command from the message which was sent and cuts out the prefix
    // So when you check if a specific command was executed, you must not type
    //   if(command === commandprefix + "help" )
    // but you can type:
    //   if(command === "help")
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(commandPrefix.length);

    // Lets do now the commands!

    // First command is "hello"
    // It just sends a message which says hello to you.

    if(command === "hello"){
        // We´re sending a message to the channel where the command was executed.
        // Then we´re getting the author of the message and tag him to our message.
        message.channel.send("Hello " + message.author + "! Nice to meet you. :smiley: ");
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

    if (command ==="watchwebsite") 
    {
        if (!message.member.roles.find(r=>r.name === superrolename) && !message.member.roles.find(r=>r.name === adminrolename))  {
            message.channel.send(message.author+": and who the fuck are you to ask me that?");
            return;
        }

        if (checkwebsite) {
            message.channel.send(message.author+": I'm already watching website \""+watchedwebsite+"\" and I'm too stupid to watch more than one. Complain to Morce.");
            return;
        }

        watchedwebsite = message.content.toLowerCase().split(" ");
        if (watchedwebsite.length === 1) {
            message.channel.send(message.author + " what fucking site?");
            return;
        }
        if (watchedwebsite.length > 2) {            
            message.channel.send(message.author + " which fucking site?");
            return;
        }
        watchedwebsite = watchedwebsite[1];
        firstrunwebsite();
        if (watchedwebsite.startsWith("https://")) {
            checkwebsite = 1;
            watchwebsitehttps(watchedwebsite);
        } else if (watchedwebsite.startsWith("http://")) {
            checkwebsite = 1;
            watchwebsitehttps(watchedwebsite);
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

        if (!checkwebsite) {
            message.channel.send("I-I'm not doing that, "+message.author+"!");
            return;
        }

        watchedwebsite = "";
        checkwebsite = 0;
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
            message.channel.send(message.author+": I'm quite fine, thank you. Errors so far: "+errors);
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

    if (command ==="iwannawatchtoo") {
        if (message.member.roles.find(r=>r.name === rolename)) {
            message.channel.send(message.author+": you're already on the list, you silly goose.");
            return;
        }
        message.member.addRole(role).catch(console.error);
        message.channel.send(message.author+": Congratulations! You are now a stalker.");
    }

    if (command ==="idontwannawatchanymore") {
        if (!message.member.roles.find(r=>r.name === rolename)) {
            message.channel.send(message.author+": you're not watching anything, you donut.");
            return;
        }
        message.member.removeRole(role).catch(console.error);
        message.channel.send(message.author+": Congratulations! You are no longer a stalker.");
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
                                    alertchannel.send(role.mention+" **OH MY GOD, "+user+" MADE A POST!!**\n https://www.reddit.com/u/"+user+"/submitted");                                    
                                }
                                currentposts=posts;
                            }
                            firstrunp = 1;
                        } catch (ex) {
                            console.log(ex);
                        }


                    })
                    
                }).on('error', (e) => {
                    console.log(e);
                    errors++;
                    lasterror = Date.now();
                    errorchannel.send("Had an issue getting "+user+"'s posts: "+e.message+" (code "+error.http_code+")");
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
                            let obj = JSON.parse(data);                        ;
                            let comments = obj["data"]["children"].length;
                            spamtriggercomments = (spamtriggercomments+1) % spamcount;
                            if (spamtriggercomments === 1) {
                                spamchannel.send("User "+user+" has "+comments+" comments. " + (firstrunc?(comments!==currentcomments?" (**changed!!**)":"(unchanged)"):"(first run)"));
                            }
                            if (comments!==currentcomments) {
                                if (firstrunc){
                                    alertchannel.send(role.mention+"**OH MY SWEET LORD, "+user+" COMMENTED!!**\n https://www.reddit.com/u/"+user+"/comments");
                                }
                                currentcomments=comments;
                            }
                            firstrunc = 1;

                        } catch (ex) {
                            console.log(ex);
                        }
                    })
                }).on('error', (e) => {
                    console.log(e);
                    errors++;
                    lasterror = Date.now();
                    errorchannel.send("Had an issue getting "+user+"'s comments: "+e.message+" (code "+error.http_code+")");
                })
                watchcomments(user);
            }
        }, delay);

    }
}

function watchwebsitehttps(website) {
    if (checkwebsite){
        setTimeout( () => {     
            if (checkwebsite){
                let options = {                    
                    headers: { 'User-Agent': 'argchecker/1.1' }
                }                  
                https.get(website, options, (res)=>
                {
                    let status = res.statusCode;
                    var data = "";
                    res.on("data", (chunk)=>{data+=chunk;});
                    res.on('end', ()=>{
                        try {             
                            websitehtml = data;                                        
                            spamtriggerwebsite = (spamtriggerwebsite+1) % spamcount;
                            if (spamtriggerwebsite === 1) {
                                spamchannel.send("Website "+website+" has "+currentwebsite.length+" characters. " + (firstrunw?(currentwebsite!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"first run"));
                            }
                            if (websitehtml!==currentwebsite) {
                                if (firstrunw) {
                                    alertchannel.send(role.mention+"{} **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! "+website+"**");
                                } 
                                currentwebsite=websitehtml;
                            }
                            firstrunw = 1;
                        } catch (ex) {
                            console.log(ex);
                        }
                    })
                }).on('error', (e) => {
                    console.log(e);
                    errors++;
                    lasterror = Date.now();
                    errorchannel.send("Had an issue getting website "+website+": "+e.message+" (code "+error.http_code+")");
                })
                watchwebsitehttps(website);
            }
        }, delay);
    }
}

function watchwebsitehttp(website) {
    if (checkwebsite){
        setTimeout( () => {     
            if (checkwebsite){
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
                            spamtriggerwebsite = (spamtriggerwebsite+1) % spamcount;
                            if (spamtriggerwebsite === 1) {
                                spamchannel.send("Website "+website+" has "+currentwebsite.length+" characters. " + (firstrunw?(currentwebsite!==websitehtml?" (**content changed!!**)":"(content unchanged)"):"(first run)"));
                            }
                            if (websitehtml!==currentwebsite) {
                                if (firstrunw) {
                                    alertchannel.send(role.mention+" **HOLY FUCKING SHIT, THE SITE HAS CHANGED!! ".format(role.mention)+website+"**");
                                }
                                currentwebsite=websitehtml;
                            }    
                            firstrunw = 1;                    
                        } catch (ex) {
                            console.log(ex);
                        }
                    })
                }).on('error', (e) => {
                    console.log(e);
                    errors++;
                    lasterror = Date.now();
                    errorchannel.send("Had an issue getting website "+website+": "+e.message+" (code "+error.http_code+")");
                })
                watchwebsitehttp(website);
            }
        }, delay);
    }
}



// function which log in the bot
client.login(process.env.mysweettoken);