const express = require("express");
const userFunctions = require("../database/data/users");
const chatFunctions = require("../database/data/chatrooms");
const router = express.Router();

const errorChecking = require("../database/errorChecking/errorChecking");

router.get("/", async (req, res) => {
  try {
    let users = await userFunctions.getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(404).json({ error: "User Not Found." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    req.params.id = errorChecking.checkId(req.params.id, "URL ID Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    let user = await userFunctions.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: "User Not Found." });
  }
});

router.get("/chat/:chatName", async (req, res) => {
  try {
    req.params.chatName = errorChecking.checkId(req.params.chatName, 'URL Chat Name Param');
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    let chat = await chatFunctions.getChatByName(req.params.chatName);
    res.json(chat);
  } catch (e) {
    res.status(404).json({ error: "User Not Found." });
  }
});

router.post("/chat/:chatName", async (req, res) => {
  console.log("attempting to get message0");
  const chatroomData = req.body;

  try {
    console.log("attempting to get message1");
    chatroomData.message.sender = errorChecking.checkString(
      chatroomData.message.sender, 
      'Message Sender',
      true
    );
    console.log("attempting to get message2");
    chatroomData.message.content = errorChecking.checkString(
      chatroomData.message.content,
      'Message Content',
      true
    );
    console.log("attempting to get message3");
  } catch(e) {
    return res.status(400).json({ error: e });
  }

  try {
    console.log("attempting to get message4");
    let chat = await chatFunctions.addMessageToChat(req.params.chatName, chatroomData.message);
    console.log("attempting to get message5");
    res.json(chat);
  } catch (e) {
    res.status(404).json({ error: "Chat Not Found." });
  }
});

router.post("/email/", async (req, res) => {
  try {
    req.body.email = errorChecking.checkString(
      req.body.email,
      "URL Email Param",
      true
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    let user = await userFunctions.getUserByEmail(req.body.email);
    res.json(user);
  } catch (e) {
    res.status(404).json({ error: "User Not Found." });
  }
});

router.post("/create-chatroom", async (req, res) => {
  const chatData = req.body;

  try {
    chatData.chatName = errorChecking.checkString(
      chatData.chatName, 
      'Chat Name', 
      true);
    chatData.users = errorChecking.checkArray(
      chatData.users, 
      'Chatroom Users', 
      'string', 
      true
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    console.log('please ?');
    const creatingChat = await chatFunctions.createChat(
      chatData.chatName,
      chatData.users
    );
    console.log('please ?.');

    res.json(creatingChat);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/delete-chatroom", async (req, res) => {
  const chatData = req.body;

  try {
    chatData.chatName = errorChecking.checkString(
      chatData.chatName, 
      'Chat Name', 
      true);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const chat = await chatFunctions.getChatByName(chatData.chatName);
    console.log(chat);
    const deletingChat = await chatFunctions.deleteChat(chat._id.toString());

    res.json(deletingChat);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/create-user-profile", async (req, res) => {
  const userSignUpInfo = req.body;

  try {
    userSignUpInfo.firstName = errorChecking.checkString(
      userSignUpInfo.firstName,
      "First Name",
      false
    );
    userSignUpInfo.lastName = errorChecking.checkString(
      userSignUpInfo.lastName,
      "Last Name",
      true
    );
    userSignUpInfo.email = errorChecking.checkString(
      userSignUpInfo.email,
      "Email",
      true
    );
    userSignUpInfo.description = errorChecking.checkString(
      userSignUpInfo.description,
      "Description",
      true
    );
    userSignUpInfo.funFact = errorChecking.checkString(
      userSignUpInfo.funFact,
      "Fun Fact",
      true
    );
    userSignUpInfo.other = errorChecking.checkString(
      userSignUpInfo.other,
      "Other",
      true
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const userExist = await userFunctions.getUserByEmail(userSignUpInfo.email);
    if(userExist) {
      throw 'Error: User already exists with that email.'
    }

    const newUser = {
      firstName: userSignUpInfo.firstName,
      lastName: userSignUpInfo.lastName,
      email: userSignUpInfo.email,
      bio: {
        description: userSignUpInfo.description,
        funFact: userSignUpInfo.funFact,
        other: userSignUpInfo.other,
      }
    };
    console.log("chekcin")
    const creatingUser = await userFunctions.addUser(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.bio
    );
    console.log("chekcin2")
    res.json(creatingUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/update-user/:id", async (req, res) => {
  const updatedUserInfo = req.body.updatedUser;
  console.log("----------Updated User Info --------");
  console.log(updatedUserInfo);
  try {
    req.params.id = errorChecking.checkId(req.params.id, "URL ID Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    updatedUserInfo.firstName = errorChecking.checkString(
      updatedUserInfo.firstName,
      "First Name",
      false
    );
    updatedUserInfo.lastName = errorChecking.checkString(
      updatedUserInfo.lastName,
      "Last Name",
      true
    );
    updatedUserInfo.email = errorChecking.checkString(
      updatedUserInfo.email,
      "Email",
      true
    );
    // updatedUserInfo.spotifyUsername = errorChecking.checkString(
    //   updatedUserInfo.spotifyUsername,
    //   "Spotify Username",
    //   true
    // );
    /*
    updatedUserInfo.pfp_url = errorChecking.checkString(
      updatedUserInfo.pfp_url,
      "Profile Pic URL",
      true
    );
    */
    updatedUserInfo.bio.description = errorChecking.checkString(
      updatedUserInfo.bio.description,
      "Description",
      true
    );
    updatedUserInfo.bio.funFact = errorChecking.checkString(
      updatedUserInfo.bio.funFact,
      "Fun Fact",
      true
    );
    updatedUserInfo.bio.other = errorChecking.checkString(
      updatedUserInfo.bio.other,
      "Other",
      true
    );
    updatedUserInfo.matches = errorChecking.checkArray(
      updatedUserInfo.matches,
      "Matches",
      "object",
      true
    );
    updatedUserInfo.rejects = errorChecking.checkArray(
      updatedUserInfo.rejects,
      "Rejects",
      "object",
      true
    );
    updatedUserInfo.prospectiveMatches = errorChecking.checkArray(
      updatedUserInfo.prospectiveMatches,
      "Prospective Matches",
      "object",
      true
    );
    updatedUserInfo.topArtists = errorChecking.checkArray(
      updatedUserInfo.topArtists,
      "Top Artists",
      "string",
      true
    );
    updatedUserInfo.topArtistImgs = errorChecking.checkArray(
      updatedUserInfo.topArtistImgs,
      "Top Artists Images",
      "string",
      true
    );
    updatedUserInfo.topTracks = errorChecking.checkArray(
      updatedUserInfo.topTracks,
      "Top Tracks",
      "string",
      true
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }

  try {
    const updateUserData = {
      firstName: updatedUserInfo.firstName,
      lastName: updatedUserInfo.lastName,
      email: updatedUserInfo.email,
      spotifyUsername: updatedUserInfo.spotifyUsername,
      pfp_url: updatedUserInfo.pfp_url,
      bio: {
        description: updatedUserInfo.bio.description,
        funFact: updatedUserInfo.bio.funFact,
        other: updatedUserInfo.bio.other,
      },
      matches: updatedUserInfo.matches,
      rejects: updatedUserInfo.rejects,
      prospectiveMatches: updatedUserInfo.prospectiveMatches,
      topArtists: updatedUserInfo.topArtists,
      topArtistImgs: updatedUserInfo.topArtistImgs,
      topTracks: updatedUserInfo.topTracks,
    };

    const updatingUser = await userFunctions.updateUser(
      req.params.id,
      updateUserData
    );

    res.json(updatingUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
