const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const chats = data.chats;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    const cindy = await users.addUser('Cindy', 'Zhang', 'spotifyUser101', {description: 'cindys description', funFact: 'cindys fun fact', other: 'cindys other'});
    const cindy_id = cindy._id.toString();

    await chats.createChat([cindy_id]);

    console.log('Done seeding database');
        
    await dbConnection.closeConnection();
}

main();