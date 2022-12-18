const express = require("express");
const userFunctions = require("../database/data/users");
const router = express.Router();

const errorChecking = require("../database/errorChecking/errorChecking");

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

router.post("/email/", async (req, res) => {
  try {
    req.body.email = errorChecking.checkString(req.body.email, "URL Email Param", true);
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
    const newUser = {
      firstName: userSignUpInfo.firstName,
      lastName: userSignUpInfo.lastName,
      email: userSignUpInfo.email,
      bio: {
        description: userSignUpInfo.description,
        funFact: userSignUpInfo.funFact,
        other: userSignUpInfo.other,
      },
    };

    const creatingUser = await userFunctions.addUser(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.bio
    );

    res.json(creatingUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/update-user/:id", async (req, res) => {
  const updatedUserInfo = req.body;

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
    updatedUserInfo.spotifyUsername = errorChecking.checkString(
      updatedUserInfo.spotifyUsername,
      "Spotify Username",
      true
    );
    updatedUserInfo.description = errorChecking.checkString(
      updatedUserInfo.description,
      "Description",
      true
    );
    updatedUserInfo.funFact = errorChecking.checkString(
      updatedUserInfo.funFact,
      "Fun Fact",
      true
    );
    updatedUserInfo.other = errorChecking.checkString(
      updatedUserInfo.other,
      "Other",
      true
    );
    updatedUserInfo.matches = errorChecking.checkArray(
      updatedUserInfo.matches,
      "Matches",
      "string",
      true
    );
    updatedUserInfo.rejects = errorChecking.checkArray(
      updatedUserInfo.rejects,
      "Rejects",
      "string",
      true
    );
    updatedUserInfo.prospectiveMatches = errorChecking.checkArray(
      updatedUserInfo.prospectiveMatches,
      "Prospective Matches",
      "string",
      true
    );
    updatedUserInfo.topArtists = errorChecking.checkArray(
      updatedUserInfo.topArtists,
      "Top Artists",
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
    return res.status(400).json({ error: e });
  };

  try {
    const updateUserData = {
      firstName: userSignUpInfo.firstName,
      lastName: userSignUpInfo.lastName,
      email: userSignUpInfo.email,
      bio: {
        description: userSignUpInfo.description,
        funFact: userSignUpInfo.funFact,
        other: userSignUpInfo.other,
      },
      matches: userSignUpInfo.matches,
      rejects: userSignUpInfo.rejects,
      prospectiveMatches: userSignUpInfo.prospectiveMatches,
      topArtists: userSignUpInfo.topArtists,
      topTracks: userSignUpInfo.topTracks,
    };

    const updatingUser = await userFunctions.updateUser(req.params.id, updateUserData);

    res.json(updatingUser);
  } catch (e) {
    res.status(500).json({ error: e });
  }

});

module.exports = router;
