var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var User = require("../model/User");
const Message = require("../model/Message");
const SECRET_KEY = "qwerty";
const userController = {};
userController.register = function (req, res) {
  // console.log(req)
  let { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please fill all field" });
  }
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "user already exist" });

    const newUser = new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            SECRET_KEY,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
};

userController.login = function (req, res) {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "please fill all field" });
  }
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "user does not exist" });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.id },
        SECRET_KEY,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
};

userController.getUser = function (req, res) {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
    .catch((err) => {
      res.json({
        msg: "error",
      });
    });
};

userController.getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.find({ _id: { $ne: userId } });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

userController.getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    var friendId = req.params.id
  
    const msgs=await Message.find({}).sort({"time":1})
    // console.log(msgs)
    const m = msgs.filter(el=>{
      if ((el.from == userId && el.to == friendId) || (el.from == friendId && el.to == userId)) {
          return el
      }
    })
    res.send(m)
     
   
  } catch (err) {
    console.log(err);
  }
};
module.exports = userController;
