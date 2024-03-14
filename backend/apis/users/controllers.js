const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../../utils/tryCatch");
const AppError = require("../../utils/AppError");
const authServices = require("./services");
const { User } = require("../../Models/user");

exports.SignUp = tryCatch(async (req, res) => {
  console.log(req);
  const { email, password } = req.body;

  const user = await User.find({ email: email });
  console.log(user);
  if (!user) {
    throw new AppError(
      409,
      "Email address already exits in the database!",
      409
    );
  }

  try {
    const response = await authServices.signUp(email, password);
    const accessToken = response.token.accesstoken;
    const refreshToken = response.token.refreshtoken;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken: accessToken }).end();
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json(err.message).end();
  }
});

exports.SignIn = tryCatch(async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(
      404,
      "Email address not found. Please check your email and try again.",
      404
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError(
      401,
      "Incorrect password. Please double-check your password and try again.",
      401
    );
  }

  try {
    let newRefreshTokenArray = "";

    // Check if user has an existing refresh token
    if (!cookies?.jwt) {
      refreshToken = user.refreshtoken;
    } else {
      refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      if (!foundToken) {
        console.log("Attempted refresh token reuse at login!");
        // If the token is not found in the database, clear out the cookie
        res.clearCookie("jwt", { httpOnly: true });
        refreshToken = "";
      }
    }
    const response = await authServices.signIn(user, newRefreshTokenArray);
    const accessToken = response.token.accesstoken;
    refreshToken = response.token.refreshtoken;
    const profilePic = response.profilePic;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ accessToken: accessToken, profilePic: profilePic })
      .end();
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).json(err.message).end();
  }
});

exports.refreshToken = tryCatch(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true });
  const foundUser = await User.findOne({ refreshtoken: refreshToken });
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        const hackedUser = await User.findOne({ username: decoded._id });
        hackedUser.refreshtoken = [];
        const result = await hackedUser.save();
      }
    );
    return res.sendStatus(403);
  }

  const newRefreshTokenArray = foundUser.refreshtoken.filter(
    (rt) => rt !== refreshToken
  );

  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshtoken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser._id.toString() !== decoded._id) {
        return res.sendStatus(403);
      }
      //refreshtoken still valid
      const accessToken = jwt.sign(
        { _id: decoded._id },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "10s" }
      );

      const newRefreshToken = jwt.sign(
        { _id: foundUser._id },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: "1d" }
      );
      foundUser.refreshtoken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json(accessToken);
    }
  );
});

exports.logOut = tryCatch(async (req, res) => {
  //on client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  //is refresh token in db?
  const foundUser = await User.findOne({ refreshtoken: refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  //Delete refreshToken in db
  foundUser.refreshtoken = foundUser.refreshtoken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
});

exports.getUserData = tryCatch(async (req, res) => {
  const userId = req.params.id;
  const foundUser = await User.findOne({ _id: userId });

  const data = {
    userEmail: foundUser.email,
  };

  res.status(200).json(data).end();
});
