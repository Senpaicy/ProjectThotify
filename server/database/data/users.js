const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
// const imagemagick = require('imagemagick');
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
    id = errorChecking.checkId(id, "id");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found";
    return user;
  },
  async getUserByEmail(userEmail) {
    userEmail = errorChecking.checkString(userEmail, 'User Email', true);

    const userCollection = await users();
    const user = await userCollection.findOne({ email: userEmail });
    // if (!user) throw "User not found";
    
    return user;
  },
  async addUser(firstName, lastName, email, bio) {
    firstName = errorChecking.checkString(firstName, "First Name", false);
    lastName = errorChecking.checkString(lastName, "Last Name", false);
    console.log("chekcin")
    email = errorChecking.checkString(email, "Email", true);
    console.log("chekcin")
    email = errorChecking.checkEmail(email);
    console.log("made it past email check");
    bio.description = errorChecking.checkString(
      bio.description,
      "Bio Description",
      true
    );
    bio.funFact = errorChecking.checkString(bio.funFact, "Bio Fun Fact", true);
    bio.other = errorChecking.checkString(bio.other, "Bio Other", true);

    const userCollection = await users();

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      spotifyUsername: "",
      pfp_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      bio: bio,
      matches: [],
      rejects: [],
      prospectiveMatches: [],
      topArtists: [],
      topArtistImgs: [],
      topTracks: []
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";

    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async removeUser(id) {
    id = errorChecking.checkId(id, "id");

    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0)
      throw `Error: Could not delete user with id of ${id}`;

    return true;
  },
  async updateUser(id, updatedUser) {
    id = errorChecking.checkId(id, "id");
    updatedUser.firstName = errorChecking.checkString(
      updatedUser.firstName,
      "First Name",
      false
    );
    updatedUser.lastName = errorChecking.checkString(
      updatedUser.lastName,
      "Last Name",
      false
    );
    // updatedUser.spotifyUsername = errorChecking.checkString(
    //   updatedUser.spotifyUsername,
    //   "Spotify Username",
    //   true
    // );
    /*
    updatedUser.pfp_url = errorChecking.checkString(
      updatedUser.pfp_url,
      "Profile Url",
      true
    );
    */
    updatedUser.email = errorChecking.checkString(
      updatedUser.email,
      "email",
      true
    );
    updatedUser.email = errorChecking.checkEmail(
      updatedUser.email
    );
    updatedUser.bio.description = errorChecking.checkString(
      updatedUser.bio.description,
      "Bio Description",
      true
    );
    updatedUser.bio.funFact = errorChecking.checkString(
      updatedUser.bio.funFact,
      "Bio Fun Fact",
      true
    );
    updatedUser.bio.other = errorChecking.checkString(
      updatedUser.bio.other,
      "Bio Other",
      true
    );
    updatedUser.matches = errorChecking.checkArray(
      updatedUser.matches,
      "Matches",
      "object",
      true
    );
    updatedUser.rejects = errorChecking.checkArray(
      updatedUser.rejects,
      "Rejects",
      "object",
      true
    );
    updatedUser.prospectiveMatches = errorChecking.checkArray(
      updatedUser.prospectiveMatches,
      "Prospective Matches",
      "object",
      true
    );
    updatedUser.topArtists = errorChecking.checkArray(
      updatedUser.topArtists,
      "Top Artists",
      "string",
      true
    );
    updatedUser.topArtistImgs = errorChecking.checkArray(
      updatedUser.topArtistImgs,
      "Top Artists Images",
      true
    );
    updatedUser.topTracks = errorChecking.checkArray(
      updatedUser.topTracks,
      "Top Tracks",
      "string",
      true
    );

    let userUpdateInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      email: updatedUser.email,
      spotifyUsername: updatedUser.spotifyUsername,
      pfp_url: updatedUser.pfp_url,
      matches: updatedUser.matches,
      rejects: updatedUser.rejects,
      prospectiveMatches: updatedUser.prospectiveMatches,
      topArtists: updatedUser.topArtists,
      topArtistImgs: updatedUser.topArtistImgs,
      topTracks: updatedUser.topTracks
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";

    return await this.getUserById(id);
  },
};

module.exports = exportedMethods;
