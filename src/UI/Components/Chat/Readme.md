Blank chat:

    <Chat />

Full chat:

    var props = {
        messages: [
            {text: 'Hello'},
            {text: 'Hows it going man?'},
            {text: 'Super Saiyannnn!'}
        ]
    };

    <Chat {...props} />

Example chat:

    var props = {
        messages: [
            {name: "Cthon98", text: "hey, if you type in your pw, it will show as stars"},
            {name: "Cthon98", text: "********* see!"},
            {name: "AzureDiamond", text: "hunter2"},
            {name: "AzureDiamond", text: "doesnt look like stars to me"},
            {name: "Cthon98", text: "<AzureDiamond> *******"},
            {name: "Cthon98", text: "thats what I see"},
            {name: "AzureDiamond", text: "oh, really?"},
            {name: "Cthon98", text: "Absolutely"},
            {name: "AzureDiamond", text: "you can go hunter2 my hunter2-ing hunter2"},
            {name: "AzureDiamond", text: "haha, does that look funny to you?"},
            {name: "Cthon98", text: "lol, yes. See, when YOU type hunter2, it shows to us as *******"},
            {name: "AzureDiamond", text: "thats neat, I didnt know IRC did that"},
            {name: "Cthon98", text: "yep, no matter how many times you type hunter2, it will show to us as *******"},
            {name: "AzureDiamond", text: "awesome!"},
            {name: "AzureDiamond", text: "wait, how do you know my pw?"},
            {name: "Cthon98", text: "er, I just copy pasted YOUR ******'s and it appears to YOU as hunter2 cause its your pw"},
            {name: "AzureDiamond", text: "oh, ok."},
            {name: "Donut", text: "HEY EURAKARTE"},
            {name: "Donut", text: "INSULT"},
            {name: "Eurakarte", text: "RETORT"},
            {name: "Donut", text: "COUNTER-RETORT"},
            {name: "Eurakarte", text: "QUESTIONING OF SEXUAL PREFERENCE"},
            {name: "Donut", text: "SUGGESTION TO SHUT THE FUCK UP"},
            {name: "Eurakarte", text: "NOTATION THAT YOU CREATE A VACUUM"},
            {name: "Donut", text: "RIPOSTE"},
            {name: "Donut", text: "ADDON RIPOSTE"},
            {name: "Eurakarte", text: "COUNTER-RIPOSTE"},
            {name: "Donut", text: "COUNTER-COUNTER RIPOSTE"},
            {name: "Eurakarte", text: "NONSENSICAL STATEMENT INVOLVING PLANKTON"},
            {name: "Miles_Prower", text: "RESPONSE TO RANDOM STATEMENT AND THREAT TO BAN OPPOSING SIDES"},
            {name: "Eurakarte", text: "WORDS OF PRAISE FOR FISHFOOD"},
            {name: "Miles_Prower", text: "ACKNOWLEDGEMENT AND ACCEPTENCE OF TERMS"},
            {name: "0rbad", text: "so there i was in this hallway right"},
            {name: "lackAdder", text: "i believe i speak for all of us when i say..."},
            {name: "lackAdder", text: "WRONG BTICH"},
            {name: "lackAdder", text: "IM SICK OF YOU"},
            {name: "lackAdder", text: "AND YOUR LAME STORIES"},
            {name: "lackAdder", text: "NOBODY  HERE THINKS YOURE FUNNY"},
            {name: "lackAdder", text: "NOBODY HERE WANTS TO HEAR YOUR STORIES"},
            {name: "lackAdder", text: "IN FACT"},
            {name: "lackAdder", text: "IF YOU DIED RIGHT NOW"},
            {name: "lackAdder", text: "I  DONT THINK NOBODY WOULD CARE"},
            {name: "lackAdder", text: "SO WHAT DO YOU SAY TO THAT FAG"},
            {name: "**", text: "0rbad sets mode: +b BlackAdder*!*@*.*"},
            {name: "**", text: "lackAdder has been kicked my t0rbad ( )"},
            {name: "0rbad", text: "so there i was in this hallway right"},
            {name: "RCError", text: "right"},
            {name: "eartless", text: "Right."},
            {name: "3v", text: "right"},
            {name: 'erno', text: "hm. I've lost a machine.. literally _lost_. it responds to ping, it works completely, I just can't ,figue out where in my apartment it is."},
            {name: "Zybl0re", text: "get up"},
            {name: "Zybl0re", text: "get on up"},
            {name: "Zybl0re", text: "get up"},
            {name: "Zybl0re", text: "get on up"},
            {name: "phxl", text: "and DANCE"},
            {name: "nmp3bot", text: "ances :D-<"},
            {name: "nmp3bot", text: "ances :D|-<"},
            {name: "nmp3bot", text: "ances :D/-<"},
            {name: "HatfulOfHollow", text: "i'm going to become rich and famous after i invent a device that allows you to stab ,peope in the face over the internet"},
            {name: "Guo_Si", text: "Hey, you know what sucks?"},
            {name: "TheXPhial", text: "vaccuums"},
            {name: "Guo_Si", text: "Hey, you know what sucks in a metaphorical sense?"},
            {name: "TheXPhial", text: "black holes"},
            {name: "Guo_Si", text: "Hey, you know what just isn't cool?"},
            {name: "TheXPhial", text: "lava?"},
            {name: "tatclass", text: "YOU ALL SUCK DICK"},
            {name: "tatclass", text: "er."},
            {name: "tatclass", text: "hi."},
            {name: "andy", text: "ode> A common typo."},
            {name: "tatclass", text: "the keys are like right next to each other."},
            {name: "DeadMansHand", text: "haha, last night, me and pete went out to celebrate his engagement and got hugely drunk"},
            {name: 'DeadMansHand', text: "we got this great idea to bury eachother in the sand close to the water and see who would ,chicen out first"},
            {name: "DeadMansHand", text: "took about a half hour, but the water got up to my face so i freaked and got out"},
            {name: 'DeadMansHand', text: "i looked around for pete and he must've chickened out before me and stumbled home or something ,heh"},
            {name: "DeadMansHand", text: "What'd he say when he woke up this morning?"},
            {name: "Thirteen", text: " uhh.. he hasn't come home yet.. i thought he was staying with you?"},
            {name: "DeadMansHand", text: "holy fuck."},
            {name: "DeadMansHand", text: "i fucking hope im wrong about what im thinking right now"},
            {name: "DeadMansHand", text: "im fucking going back to the beach to make sure"},
            {name: "DeadMansHand", text: "if he gets home, call me, i don't want to be worrying about this"},
            {name: "Thirteen", text: " will do. you better hope he's not still buried, you'll be in deep shit."},
            {name: "uit", text: "(DeadMansHand)"},
            {name: "Tyran", text: "wtf? pete came home last night you fuck. Ken's going to be worrying about this shit all day"},
            {name: "Thirteen", text: " haha yea, but it will be fun while it lasts"},
            {name: "PeteRepeat", text: "fucking ken"},
            {name: 'PeteRepeat', text: "ken... that fucker buried me in the sand last night, i ran off about 5 minutes to it, left him ,ther tobe an idiot"},
            {name: "quiqsilver", text: "pete, ken didn't come back last night, i thought he was with you."},
            {name: "PeteRepeat", text: "oh fuck."},
            {name: 'PeteRepeat', text: "if ken shows up, make sure he doesn't know that im at the beach digging for his body. i don't ,wanthimto think i care or anything."},
            {name: "Thirteen", text: " rofl. Those 2 are going to get a huge surprise when they meet at the beach."},
            {name: "Tyran", text: "i can't beleive how perfect their timing was"},
            {name: "Khassaki", text: "HI EVERYBODY!!!!!!!!!!"},
            {name: "Judge", text: "try pressing the the Caps Lock key"},
            {name: "Khassaki", text: "O THANKS!!! ITS SO MUCH EASIER TO WRITE NOW!!!!!!!"},
            {name: "Judge", text: "fuck me"},
            {name: 'ragonflyBlade21', text: "A woman has a close male friend. This means that he is probably interested in her, which is ,why ehangs around so much. She sees him strictly as a friend. This always starts out with, you're a great guy, but I don't like you in that way. This is roughly the equivalent for the guy of going to a job interview and the company saying, You have a great resume, you have all the qualifications we are looking for, but we're not going to hire you. We will, however, use your resume as the basis for comparison for all other applicants. But, we're going to hire somebody who is far less qualified and is probably an alcoholic. And if he doesn't work out, we'll hire somebody else, but still not you. In fact, we will never hire you. But we will call you from time to time to complain about the person that we hired."}
        ]
    };

    <Chat {...props} />

