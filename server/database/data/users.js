const mongoCollections = required("../config/mongoCollections");
const users = mongoCollections.users;
const chats = mongoCollections.chats;

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
    // TODO: Validation Error Check id
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found";
    return user;
  },
  async addUser(firstName, lastName, bio) {
    // TODO: Validation / Error parameters firstName, lastName, bio
    const userCollection = await users();

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      spotify
      bio: bio,
      matches: [],
      rejects: [],
      prospectiveMatches: [],
      topArtist: [],
      topAlbums: [],
      topGenres: [],
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async removeUser(id) {
    return null;
  },
  async updateUser(id) {
    return null;
  },
};

module.exports = exportedMethods;
