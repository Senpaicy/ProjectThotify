const mongoCollections = require('../config/mongoCollections');

const chats = mongoCollections.chats;

const { ObjectId } = require("mongodb");
const errorChecking = require("../errorChecking/errorChecking");

const exportedMethods = {
    async getAllChats() {
        const chatCollection = await chats();
        const chatList = await chatCollection.find({}).toArray();
        if (!chatList) throw "Error: There are no chats in the system.";
        return chatList;  
    },
    async getChatById(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chatCollection = await chats();
        const chat = await chatCollection.findOne({ _id: ObjectId(id) });
        if (!chat) throw "Error: Chatroom is not found.";
        return chat;
    },
    async getUsersInChat(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = this.getChatById(chat_id);
        if (!chat.users) throw 'Error: Users does not exist for this chat in the system.';
        if (chat.users === []) throw 'Error: There are no users in this chat.';

        return chat.users;
    },
    async getChatHistory(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = this.getChatById(chat_id);
        if (!chat.history) throw 'Error: Users does not exist for this chat in the system.';
        if (chat.history === []) throw 'Error: There are no users in this chat.';

        return chat.history;
    },
    async createChat(users) {
        users = errorChecking.checkArray(users, 'Chatroom Users', 'string', true);

        const chatCollection = await chat();

        let newChat = {
            users: users,
            history: []
        };

        const newInsertInformation = await chatCollection.insertOne(newChat);
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";

        return await this.getChatById(newInsertInformation.insertedId.toString());
    },
    async deleteChat(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chatCollection = await chat();
        const deletionInfo = await chatCollection.deleteOne({_id: ObjectId(id)});
        if (deletionInfo.deletedCount === 0) throw `Error: Could not delete user with id of ${id}`;

        return true;
    },
    async updateChat(chat_id) {
        // TO DO
        return null;
    }
};

module.exports = exportedMethods;