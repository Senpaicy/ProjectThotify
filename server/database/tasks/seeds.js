const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const users = data.users;
const chats = data.chats;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    const cindy = await users.addUser('Cindy', 'Zhang', 'spotifyUser101', {description: 'cindys description', funFact: 'cindys fun fact', other: 'cindys other'});
    const jacob = await users.addUser('Jacob', 'Wood', 'spotifyUser102', {description: 'jacobs description', funFact: 'jacobs fun fact', other: 'jacobs other'});
    const eric = await users.addUser('Eric', 'Rudzin', 'spotifyUser103', {description: 'erics description', funFact: 'erics fun fact', other: 'erics other'});
    const farhan = await users.addUser('Farhan', 'Shaik', 'spotifyUser104', {description: 'farhans description', funFact: 'farhans fun fact', other: 'farhans other'});
    
    const cindy_id = cindy._id.toString();
    const jacob_id = jacob._id.toString();
    const eric_id = eric._id.toString();
    const farhan_id = farhan._id.toString();

    const thotifySeedersChat = await chats.createChat('ThotifySeeders', [cindy_id, jacob_id, eric_id, farhan_id]);
    const thotifyBackendChat = await chats.createChat('ThotifyBackendChat', [cindy_id, eric_id, farhan_id]);
    const thotifyFrontendChat = await chats.createChat('ThotifyBackendChat', [cindy_id, jacob_id]);

    // ----- Printing Out 
    console.log("---------- Testing User Functions ----------");
    
    console.log("---------- getAllUsers(): ----------");
    console.log(await users.getAllUsers());

    console.log("---------- getUserById(id): ----------");
    console.log(await users.getUserById(cindy_id));

    console.log("---------- addUser(first, last, spotifyUsername, bio) ----------");
    const adrian = await users.addUser('Adrian', 'Gnomes', 'spotifyUser105', {description: 'adrians description', funFact: 'adrians fun fact', other: 'adrians other'});
    console.log(adrian);

    console.log("---------- removeUser(id) ----------");
    console.log(await users.removeUser(adrian._id.toString()));

    console.log("---------- updateUser(id, updatedUser) ----------");
    const cindyUpdate = {
        firstName: 'Cindy', 
        lastName: 'Zhang', 
        bio: {
            description: '5.4 big asian gorilla.', 
            funFact: 'cindy plays valorant a little too much.', 
            other: 'skin n bones lund is cindys favorite song.'
        }, 
        matches: [], 
        rejects: [],
        prospectiveMatches: [], 
        topArtists: ['Lund', 'Juice Wrld', 'DaBaby', 'Powfu', 'Sia'], 
        topTracks: ['Skin and Bones']
    };
    const updatingCindy = await users.updateUser(cindy_id, cindyUpdate);
    console.log(updatingCindy);

    console.log("---------- Testing Chat Functions ----------");
    console.log("---------- getAllChats() ----------");
    console.log(await chats.getAllChats());

    console.log("---------- getChatById(chat_id) ----------");
    console.log(await chats.getChatById(thotifySeedersChat._id.toString()));

    console.log("---------- getUsersInChat(chat_id) ----------");
    console.log(await chats.getUsersInChat(thotifySeedersChat._id.toString()));

    console.log("---------- getChatHistory(chat_id) ----------");
    console.log(await chats.getChatHistory(thotifySeedersChat._id.toString()));

    console.log("---------- createChat(chatName, users)----------");
    const tempChat = await chats.createChat('TemporaryChat', []);
    console.log(tempChat);

    console.log("---------- deleteChat ----------");
    console.log(await chats.deleteChat(tempChat._id.toString()));

    console.log("---------- updateChat ----------");
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
    console.log(await chats.updateChat(thotifySeedersChat._id.toString(), chatUpdate1));

    console.log('---------------------');
    console.log('Done seeding database');
        
    await dbConnection.closeConnection();
}

main();