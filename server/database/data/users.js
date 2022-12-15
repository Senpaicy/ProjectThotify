const mongoCollections = required("../config/mongoCollections");
const users = mongoCollections.users;
// const chats = mongoCollections.chats;

const { ObjectId } = require("mongodb");
const errorChecking = require("../errorChecking/errorChecking");

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw "No user in system!";
    return userList;
  },
  async getUserById(id) {
    id = errorChecking.checkId(id, 'id');

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found";
    return user;
  },
  async addUser(firstName, lastName, spotifyUsername, bio) {
    firstName = errorChecking.checkString(firstName, 'First Name', false);
    lastName = errorChecking.checkString(lastName, 'Last Name', false);
    spotifyUsername = errorChecking.checkString(spotifyUsername, 'Spotify Username', true);
    bio.description = errorChecking.checkString(bio.description, 'Bio Description', true);
    bio.funFact = errorChecking.checkString(bio.funFact, 'Bio Fun Fact', true);
    bio.other = errorChecking.checkString(bio.other, 'Bio Other', true);

    const userCollection = await users();

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      spotifyUserame: spotifyUsername,
      bio: bio,
      matches: [],
      rejects: [],
      prospectiveMatches: [],
      topArtists: [],
      topAlbums: [],
      topGenres: [],
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";

    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async removeUser(id) {
    id = errorChecking.checkId(id, 'id');

    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return true;
  },
  async updateUser(id, updatedUser) {
    id = errorChecking.checkId(id, 'id');
    updatedUser.firstName = errorChecking.checkString(updatedUser.firstName, 'First Name', false);
    updatedUser.lastName = errorChecking.checkString(updatedUser.lastName, 'Last Name', false);
    updatedUser.bio.description = errorChecking.checkString(updatedUser.bio.description, 'Bio Description', true);
    updatedUser.bio.funFact = errorChecking.checkString(updatedUser.bio.funFact, 'Bio Fun Fact', true);
    updatedUser.bio.other = errorChecking.checkString(updatedUser.bio.other, 'Bio Other', true);

    updatedUser.matches = errorChecking.checkArray(updatedUser.matches, 'Matches', 'string', true);
    updatedUser.rejects = errorChecking.checkArray(updatedUser.rejects, 'Rejects', 'string', true);
    updatedUser.prospectiveMatches = errorChecking.checkArray(updatedUser.prospectiveMatches, 'Prospective Matches', 'string', true);
    updatedUser.topArtists = errorChecking.checkArray(updatedUser.topArtists, 'Top Artists', 'string', true);
    updatedUser.topAlbums = errorChecking.checkArray(updatedUser.topAlbums, 'Top Albums', 'string', true);
    updatedUser.topGenres = errorChecking.checkArray(updatedUser.topGenres, 'Top Genres', 'string', true);

    let userUpdateInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      matches: updatedUser.matches,
      rejects: updatedUser.rejects,
      prospectiveMatches: updatedUser.prospectiveMatches,
      topArtists: updatedUser.topArtists,
      topAlbums: updatedUser.topAlbums,
      topGenres: updatedUser.topGenres,
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      {_id: ObjectId(id)},
      {$set: userUpdateInfo}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    
    return await this.getUserById(id);
  },
};

module.exports = exportedMethods;
