const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const users = data.users;
const chats = data.chats;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    console.log("Creating User Objects: ");
    console.log("------- Attempting to create cUser object...");
    const cUser = {
        firstName: "Cindy",
        lastName: "Zhang",
        email: "czhang@gmail.com",
        bio: {
            description: "cindy is doing database seeding right now.",
            funFact: "do you think trees poop?",
            other: "that's how they make no.2 pencils."
        }
    }
    console.log("------- Finished creating cUser object.");
    console.log("------- Attempting to create jUser object...");
    const jUser = {
        firstName: "Jacob",
        lastName: "Wood",
        email: "jwood@gmail.com",
        bio: {
            description: "jacob is a god tier developer n kill the chat!",
            funFact: "i need a joke from jacob.",
            other: "but he's probably asleep."
        }
    }
    console.log("------- Finished creating jUser object.");
    console.log("------- Attempting to create eUser object...");
    const eUser = {
        firstName: "Eric",
        lastName: "Rudzin",
        email: "eRuddy@gmail.com",
        bio: {
            description: "i hope eric works at spotify one day due to his amazing spotify api skills.",
            funFact: "ahaha",
            other: "i like that"
        }
    }
    console.log("------- Finished creating eUser object.");
    console.log("------- Attempting to create fUser object...");
    const fUser = {
        firstName: "Farhan",
        lastName: "Shaik",
        email: "fshaik@gmail.com",
        bio: {
            description: "i hope farhan gets the depolyment done.",
            funFact: "today",
            other: "praying"
        }
    }
    console.log("------- Finished creating fUser object.");

    console.log();

    console.log("Adding User Objects to User Database: ");
    console.log("------- Attempting to add cindy to user database...");
    const cindy = await users.addUser(cUser.firstName, cUser.lastName, cUser.email, cUser.bio);
    console.log("------- Finished adding cindy to user database.");
    console.log("------- Attempting to add jacob to user database...");
    const jacob = await users.addUser(jUser.firstName, jUser.lastName, jUser.email, jUser.bio);
    console.log("------- Finished adding jacob to user database.");
    console.log("------- Attempting to add eric to user database...");
    const eric = await users.addUser(eUser.firstName, eUser.lastName, eUser.email, eUser.bio);
    console.log("------- Finished adding eric to user database.");
    console.log("------- Attempting to add farhan to user database...");
    const farhan = await users.addUser(fUser.firstName, fUser.lastName, fUser.email, fUser.bio);
    console.log("------- Finished adding farhan to user database.");

    console.log();

    console.log("Getting User Object's Ids: ");
    console.log("------- Attempting to get cindy's id...");
    const cindy_id = cindy._id.toString();
    console.log("------- Finished getting cindy's id.");
    console.log("------- Attempting to get jacobs's id...");
    const jacob_id = jacob._id.toString();
    console.log("------- Finished getting jacob's id.");
    console.log("------- Attempting to get eric's id...");
    const eric_id = eric._id.toString();
    console.log("------- Finished getting eric's id.");
    console.log("------- Attempting to get farhan's id...");
    const farhan_id = farhan._id.toString();
    console.log("------- Finished getting farhan's id.");

    console.log();

    console.log("Creating Chat Objects: ");
    console.log("------- Attempting to create tChat object...");
    const tChat = {
        chatName: "ThotifySeeders",
        users: [cindy_id, jacob_id, eric_id, farhan_id]
    }
    console.log("------- Finished creating tChat object.");
    console.log("------- Attempting to create fChat object...");
    const fChat = {
        chatName: "ThotifyFrontend",
        users: [cindy_id, jacob_id, eric_id]
    }
    console.log("------- Finished creating fChat object.");
    console.log("------- Attempting to create bChat object...");
    const bChat = {
        chatName: "ThotifyBackend",
        users: [cindy_id, jacob_id, eric_id]
    }
    console.log("------- Finished creating bChat object.");

    console.log();

    console.log("Adding Chat Objects to Chat Database: ");
    console.log("------- Attempting to add seeders chat...");
    const seeders = await chats.createChat(tChat.chatName, tChat.users);
    console.log("------- Finished adding seeders chat.");
    console.log("------- Attempting to add frontend chat...");
    const frontend = await chats.createChat(fChat.chatName, fChat.users);
    console.log("------- Finished adding frontend chat.");
    console.log("------- Attempting to add backend chat...");
    const backend = await chats.createChat(bChat.chatName, bChat.users);
    console.log("------- Finished adding backend chat.");

    console.log();

    console.log("Getting Chat's Object's Ids: ");
    console.log("------- Attempting to get seeders chat's id...");
    const seeders_id = seeders._id.toString();
    console.log("------- Finished getting seeders chat's id.");
    console.log("------- Attempting to get frontend chat's id...");
    const frontend_id = frontend._id.toString();
    console.log("------- Finished getting frontend chat's id.");
    console.log("------- Attempting to get backend chat's id...");
    const backend_id = backend._id.toString();
    console.log("------- Finished getting backend's id.");

    console.log(); 

    console.log("Getting All Users In User Database: ");
    console.log("------- Attempting to get all users in user database...");
    const allUsers = await users.getAllUsers();
    console.log("------- Finished getting all users in user database.");

    console.log();

    console.log("Getting User By Id from User Database: ");
    console.log("------- Attempting to get cindy's user data from user database...");
    const c_user_info = await users.getUserById(cindy_id);
    console.log("------- Finished getting cindy's user data from user database.");

    console.log();

    console.log("Getting User By Email from User Database: ");
    console.log("------- Attempting to get jacob's user data from user database...");
    const j_user_info = await users.getUserByEmail(jUser.email);
    console.log("------- Finished getting jacob's user data from user database.");

    console.log();

    console.log("Removing User By Id from User Database: ");
    console.log("------- Attempting to remove farhan's user data from user database...");
    const f_delete_info = await users.removeUser(farhan_id);
    console.log("------- Finished removing farhan's user data from user database.");

    console.log();

    console.log("Creating User Updated Object: ");
    console.log("------- Attempting to create an updated user object: ");
    const cUserUpdate = {
        pfp_url: "https://media.licdn.com/dms/image/C4E03AQFWIfoJD2ddMA/profile-displayphoto-shrink_800_800/0/1613668127608?e=1677110400&v=beta&t=X7_-UGAQiiiJjYnES4Hn6St5tn_5lxjahCYRCSjB9R8",
        firstName: 'Cindy', 
        lastName: 'Zhang', 
        email: 'senpaicy@gmail.com',
        spotifyUsername: 'senpaicy',
        bio: {
            description: '5.4 big asian gorilla.', 
            funFact: 'cindy plays valorant a little too much.', 
            other: 'skin n bones lund is cindys favorite song.'
        }, 
        matches: ["63a1dd62107e86330bf14f97"], 
        rejects: [],
        prospectiveMatches: [], 
        topArtists: ['Lund', 'Juice Wrld', 'DaBaby', 'Powfu', 'Sia'],
        topArtistImgs: [
            "https://i.ytimg.com/vi/NBvOHby4ZfE/maxresdefault.jpg", 
            "https://i.ytimg.com/vi/ZengOKCUBHo/maxresdefault.jpg", 
            "https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_800,h_800,c_limit/Dababy_BabyOnBaby.jpg", 
            "https://yt3.googleusercontent.com/VGcpKuzZrkWPVoZA3rvmufVepPaaCywXFLk5Ng_PCMApUlEYjJE63MPEwi5IyJRVJYkHAV8sZg=s900-c-k-c0x00ffffff-no-rj",
            "https://upload.wikimedia.org/wikipedia/en/f/fd/Thisisacting_albumcover.png"
        ], 
        topTracks: ['Skin and Bones']
    };
    console.log("------- Finished creating an updated user object: ");
    console.log("------- Attempting to create an updated user object: ");
    const jUserUpdate = {
        firstName: "Jacob",
        lastName: "Wood",
        email: "jwood@gmail.com",
        spotifyUsername: "",
        pfp_url: "https://media.licdn.com/dms/image/C4E03AQE1oNBNmefEpA/profile-displayphoto-shrink_200_200/0/1660327397872?e=1677110400&v=beta&t=cfaI79iDBU__0PBYJ_cqjxX4gXeiukAxEx_g6X4-A9w",
        bio: {
            "description": "jacob is a god tier developer n kill the chat!",
            "funFact": "i need a joke from jacob.",
            "other": "but he's probably asleep."
        },
        matches: [],
        rejects: [],
        prospectiveMatches: [],
        topArtists: [],
        topArtistImgs: [],
        topTracks: []
    };
    console.log("------- Finished creating an updated user object: ");
    console.log("------- Attempting to create an updated user object: ");
    const eUserUpdate = {
        firstName: "Eric",
        lastName: "Rudzin",
        email: "eRuddy@gmail.com",
        spotifyUsername: "",
        pfp_url: "https://media.licdn.com/dms/image/C4D03AQFD1-yRKU941A/profile-displayphoto-shrink_100_100/0/1636663159941?e=1677110400&v=beta&t=Rg2_XrY6cToD75Pm0ERiK-OAB-sCjA70SuR4fN42j4k",
        bio: {
          "description": "i hope eric works at spotify one day due to his amazing spotify api skills.",
          "funFact": "ahaha",
          "other": "i like that"
        },
        matches: [],
        rejects: [],
        prospectiveMatches: [],
        topArtists: [],
        topArtistImgs: [],
        topTracks: []
    };
    console.log("------- Finished creating an updated user object: ");

    console.log();

    console.log("Updating User Updated Object: ");
    console.log("------- Attempting to update an updated user object: ");
    const updatingCindy = await users.updateUser(cindy_id, cUserUpdate);
    console.log("------- Finished updating an updated user object: ");
    console.log("------- Attempting to update an updated user object: ");
    const updatingJacob = await users.updateUser(jacob_id, jUserUpdate);
    console.log("------- Finished updating an updated user object: ");
    console.log("------- Attempting to update an updated user object: ");
    const updatingEric = await users.updateUser(eric_id, eUserUpdate);
    console.log("------- Finished updating an updated user object: ");

    console.log();

    console.log("Get All Chats From Chat Database: ");
    console.log("------- Attempting to get all chats from chat database: ");
    const allChats = await chats.getAllChats();
    console.log("------- Finished getting all chats from chat database: ");

    console.log();

    console.log("Get Chat by Id from Chat Database: ");
    console.log("------- Attempting to get chat by Id from chat database: ");
    const seederChatInfo1 = await chats.getChatById(seeders_id);
    console.log("------- Finished getting chat by Id from chat database: ");

    console.log();

    console.log("Get Chat by Name from Chat Database: ");
    console.log("------- Attempting to get chat by Name from chat database: ");
    const seederChatInfo2 = await chats.getChatByName(tChat.chatName);
    console.log("------- Finished getting chat by Name from chat database: ");

    console.log();

    console.log("Get Users from a Chat in the Chat Database: ");
    console.log("------- Attempting to get Users from a Chat in the chat database: ");
    const seedersUser = await chats.getUsersInChat(seeders_id);
    console.log("------- Finished getting Users from a Chat in the database: ");

    console.log();

    console.log("Creating New Message Object: ");
    console.log("------- Attempting to create new message object: ");
    const cindys_message_time = new Date;
    const cindys_message = {
        sender: cindy_id,
        content: 'Testing if I have added any messages to the chat.',
        timestamp: cindys_message_time.toDateString() + ' ' + cindys_message_time.toTimeString()
    };
    console.log("------- Finished creating new message object: ");

    console.log();

    console.log("Adding Message to a Chat: ");
    console.log("------- Attempting to add message to a chat: ");
    const addedCMessage = await chats.addMessageToChat(tChat.chatName, cindys_message);
    console.log("------- Finished adding message to a chat: ");

    console.log();

    console.log("Getting Chat History: ");
    console.log("------- Attempting to get chat history: ");
    const seederChatHistory = await chats.getChatHistory(seeders_id);
    console.log("------- Finished getting chat history ");

    console.log();

    console.log("Deleting Chat from Chat Database: ");
    console.log("------- Attempting to delete chat: ");
    const deleteChatInfo = await chats.deleteChat(backend_id);
    console.log("------- Finished deleting chat: ");

    console.log();

    console.log("Creating an Updated Chat Object for Chat Database: ");
    console.log("------- Attempting to create an updated chat object... ");
    const date = new Date();
    const chatUpdate1 = {
        history: [
            {
                sender: cindy_id,
                content: 'i just finished fucking seeding this shit.',
                timestamp: date.toDateString() + ' ' + date.toTimeString()
            }
        ]
    };
    console.log("------- Finished creating update chat info.");


    console.log();

    console.log("Updating Chat from Chat Database: ");
    console.log("------- Attempting to update chat: ");
    const updatedInfo = await chats.updateChat(seeders_id, chatUpdate1)
    console.log("------- Finished creating update chat info");

    console.log();

    console.log('Done seeding database');
        
    await dbConnection.closeConnection();
}

main();