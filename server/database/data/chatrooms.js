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
    },async getChatByName(chat_name) {
        chat_id = errorChecking.checkString(chat_name, 'Chat Name', true);

        const chatCollection = await chats();
        const chat = await chatCollection.findOne({ chatName: chat_name });
        // if (!chat) throw "Error: Chatroom is not found.";
        
        return chat;
    },
    async getUsersInChat(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = await this.getChatById(chat_id);
        if (!chat.users) throw 'Error: Users does not exist for this chat in the system.';
        if (chat.users === []) throw 'Error: There are no users in this chat.';

        return chat.users;
    },
    async addMessageToChat(chatName, message) {
        checkName = errorChecking.checkString(chatName, 'Chat Name', true);
        message.sender = errorChecking.checkString(message.sender, 'Message Sender', true);
        message.content = errorChecking.checkString(message.content, 'Message Content', true);

        const chat = await this.getChatByName(chatName);
        const chat_id = chat._id.toString();
        const newChatHistory = await this.getChatHistory(chat_id);

        console.log(newChatHistory);
        newChatHistory.push(message);

        this.updateChat(chat_id, {history: newChatHistory});
        return this.getChatById(chat_id);
    },
    async getChatHistory(chat_id) {
        chat_id = errorChecking.checkId(chat_id, 'Chat ID');

        const chat = await this.getChatById(chat_id);
        if (!chat.history) throw 'Error: Message History does not exist for this chat in the system.';
        if (chat.history === []) throw 'Error: There are no messsages in this chat.';

        return chat.history;
    },
    async createChat(chatName, users) {
        
        //chat_id = errorChecking.checkString(chat_id, 'Chat ID', true);
        chatName = errorChecking.checkString(chatName, 'Chat Name', true);
        if(await this.getChatByName(chatName)) {
            return await this.getChatByName(chatName);
        }

        console.log('attempting to create chatroom');

        users = errorChecking.checkArray(users, 'Chatroom Users', 'string', true);

        const chatCollection = await chats();
        console.log(chatCollection);

        let newChat = {
            //chat_id: chat_id,
            chatName: chatName,
            users: users,
            history: []
        };

        const newInsertInformation = await chatCollection.insertOne(newChat);
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
        let response;
        try{
            response = await this.getChatById(newInsertInformation.insertedId.toString());
            console.log(response);
        }catch(e){
            console.log(e);
            throw e;
        }

        return response;
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