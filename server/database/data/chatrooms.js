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
        const chat = await chatCollection.findOne({ _id: ObjectId(chat_id) });
        if (!chat) throw "Error: Chatroom is not found.";
        return chat;
    },
    async getUsersInChat(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = await this.getChatById(chat_id);
        if (!chat.users) throw 'Error: Users does not exist for this chat in the system.';
        if (chat.users === []) throw 'Error: There are no users in this chat.';

        return chat.users;
    },
    async getChatHistory(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = await this.getChatById(chat_id);
        if (!chat.history) throw 'Error: Users does not exist for this chat in the system.';
        if (chat.history === []) throw 'Error: There are no users in this chat.';

        return chat.history;
    },
    async createChat(chatName, users) {
        chatName = errorChecking.checkString(chatName, 'Chat Name', false);
        users = errorChecking.checkArray(users, 'Chatroom Users', 'string', true);

        const chatCollection = await chats();

        let newChat = {
            chatName: chatName,
            users: users,
            history: []
        };

        const newInsertInformation = await chatCollection.insertOne(newChat);
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";

        return await this.getChatById(newInsertInformation.insertedId.toString());
    },
    async deleteChat(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chatCollection = await chats();
        const deletionInfo = await chatCollection.deleteOne({_id: ObjectId(chat_id)});
        if (deletionInfo.deletedCount === 0) throw `Error: Could not delete user with id of ${id}`;

        return true;
    },
    async updateChat(chat_id, updatedChat) {
        const updateChatData = {};
        const chatCollection = await chats();

        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        if (updatedChat.chatName) {
            updateChatData.chatName = errorChecking.checkString(updatedChat.chatName, 'Updated Chatroom Name', false);
        }

        if (updatedChat.users) {
            updateChatData.users = errorChecking.checkArray(updatedChat.users, 'Updated Chatroom Users', 'string', true);
        }

        if (updatedChat.history) {
            updateChatData.history = errorChecking.checkArray(updatedChat.history, 'Update Chatroom History', 'object', true);
        }

        await chatCollection.updateOne(
            {_id: ObjectId(chat_id)},
            {$set: updateChatData}
        );

        return await this.getChatById(chat_id);
    }
};

module.exports = exportedMethods;