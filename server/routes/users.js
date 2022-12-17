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

router.post("/add-spotify-credentials", async (req, res) => {
  
});

module.exports = router;
