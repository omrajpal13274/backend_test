const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const flash = require("flash");
const methodOverride = require("method-override");
const session = require("express-session");
const { Leader, User } = require("./models/users");
const socketIo = require("socket.io");
const http = require("http");
const env = require("dotenv")

env.config()
//npm i bcrypt ejs express express-session flash method-override mongoose

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((err) => {
    console.log("ERROR");
    console.log(err);
  });

console.log(User.find());

let globalId = null;
let leaderEmail = null;
let globalTeam = null;
let globalIsLeader = false;
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"));

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

var number = 0;
const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("Client connected");
  console.log(socket.id, "has joined");

  socket.on("taskDone", (msg) => {
    console.log(msg);

    if (msg == true) {
      number += 5;

      socket.broadcast.emit("done", number.toString());
    }
  });

  socket.on('1tone', (data)=>{
    console.log('task one done by', data);
    updateTask(data, 'phaseOne', 'taskOne');
    
  })
});

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/registerLeader", (req, res) => {
  res.render("registerLeader", { error: null });
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: (true, "Please enter the team name"),
  },
  phaseOne: {
    taskOne: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskTwo: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskThree: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFour: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFive: {
      type: Boolean,
      required: true,
      default: false,
    },
    mainTask: {
      type: Number,
      required: true,
      default: 0,
    },
    sideTask: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  phaseTwo: {
    taskOne: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskTwo: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskThree: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFour: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFive: {
      type: Boolean,
      required: true,
      default: false,
    },
    mainTask: {
      type: Number,
      required: true,
      default: 0,
    },
    sideTask: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  phaseThree: {
    taskOne: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskTwo: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskThree: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFour: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFive: {
      type: Boolean,
      required: true,
      default: false,
    },
    mainTask: {
      type: Number,
      required: true,
      default: 0,
    },
    sideTask: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  phaseFour: {
    taskOne: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskTwo: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskThree: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFour: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskFive: {
      type: Boolean,
      required: true,
      default: false,
    },
    mainTask: {
      type: Number,
      required: true,
      default: 0,
    },
    sideTask: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

const Team = mongoose.model("team", teamSchema);

app.post("/registerLeader", async (req, res) => {
  const { team_name, username, email, password } = req.body;

  if (!team_name || !username || !email || !password) {
    return res.render("registerLeader", {
      error: "Please fill all the required fields",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.render("registerLeader", { error: "Invalid email format" });
  }

  const hash = await bcrypt.hash(password, 12);
  globalTeam = team_name;

  const allUsers = await User.find({});
  for (let single of allUsers) {
    if (single.email == email) {
      return res.render("registerLeader", {
        error: "Email already registered",
      });
    } else if (single.team == team_name) {
      return res.render("registerLeader", { error: "Team Name already taken" });
    } else if (single.username == username) {
      return res.render("registerLeader", { error: "Username already taken" });
    }
  }

  const user = new User({
    username: username,
    email: email,
    password: hash,
    isLeader: true,
    team: team_name,
  });
  const leader = new Leader({
    team: team_name,
    username: username,
    email: email,
    password: hash,
    members: [],
    isLeader: true,
  });

  const team = new Team({
    teamName: team_name,
  });
  await team.save();
  await leader.save();
  await user.save();
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render("login", { error: "Invalid username or password." });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    req.session.user_id = user._id;
    globalId = user._id;
    globalIsLeader = user.isLeader;
    if (user.isLeader) {
      globalTeam = user.team;
      leaderEmail = email;
      res.redirect("/leaderDash");
    } else {
      res.redirect("/userDash");
    }
  } else {
    res.render("login", { error: "Invalid username or password." });
  }
  // res.redirect("/team_dash")
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.send("Bellloooooooo");
});

app.get("/leaderDash", requireLogin, async (req, res) => {
  if (!globalIsLeader) {
    return res.redirect("/userDash");
  }
  const add = await Leader.findOne({ email: leaderEmail });
  const memberArray = [];
  if (add.members.length > 0) {
    for (m of add.members) {
      let indi = await User.findById(m);
      memberArray.push(indi);
    }
  }
  console.log(memberArray);
  res.render("leaderDash", {
    members: memberArray,
    name: add.username,
    team: add.team,
  });
});

app.get("/registerUser", requireLogin, (req, res) => {
  if (globalIsLeader) {
    res.render("registerUser", { error: null });
  } else {
    res.redirect("/userDash");
  }
});

app.post("/registerUser", async (req, res) => {
  if (globalIsLeader) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render("registerUser", {
        error: "Please fill all the required fields",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.render("registerUser", { error: "Invalid email format" });
    }

    const hash = await bcrypt.hash(password, 12);

    const allUsers = await User.find({});
    for (let single of allUsers) {
      if (single.username == username) {
        return res.render("registerUser", { error: "Username already taken" });
      } else if (single.email == email) {
        return res.render("registerUser", {
          error: "Email already registered",
        });
      }
    }

    const user = new User({
      username: username,
      email: email,
      password: hash,
      isLeader: false,
      team: globalTeam,
    });

    await user.save();
    const userId = await User.findOne({ username });
    const add = await Leader.findOne({ email: leaderEmail });
    add.members.push(userId._id);
    await add.save();
    res.redirect("/leaderDash");
  } else {
    res.redirect("/userDash");
  }
});

app.get("/teamdata", async (req, res) => {
  try {
    const teams = await Team.find({}); // Assuming Team is your Mongoose model
    res.json(teams);
    console.log(teams);
    
  } catch (error) {
    console.error("Error fetching teams", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

app.get("/userDash", requireLogin, async (req, res) => {
  if (globalIsLeader) {
    res.redirect("/leaderDash");
  }
  const user = await User.findById(globalId); //Always remember async await errors
  console.log(user);
  res.render("userDash", { name: user.username, team: user.team });
});

app.delete("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  const add = await Leader.findOne({ email: leaderEmail });
  const memberArray = [];
  if (add.members.length > 0) {
    for (m of add.members) {
      let indi = await User.findById(m);
      memberArray.push(indi);
    }
  }
  console.log(memberArray);
  res.redirect("/leaderDash");
});

const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("your server is running properly on hotspot");
});

// mongoose
//   .connect("mongodb://127.0.0.1:27017/impasta")
//   .then(() => {
//     console.log("Connected to Mongo");
//   })
//   .catch((err) => {
//     console.log("ERROR");
//     console.log(err);
//   });

const userSchema = new mongoose.Schema({
  team: {
    type: String,
    required: (true, "Please enter the team name"),
  },
  username: {
    type: String,
    required: (true, "Please enter the team name"),
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("user", userSchema);

async function findUser(teamName) {
  try {
    return await userModel.findOne({ team: teamName });
  } catch (error) {
    console.log(error);
  }
}
async function findTeam(teamName) {
  try {
    return await Team.findOne({ teamName: teamName });
  } catch (error) {
    console.log(error);
  }
}

async function updateTask(teamName, phaseName, taskName) {
  try {
    const user = await findTeam(teamName);
    if (!user) {
      console.log("Team not found");
      return;
    }
    socket.broadcast.emit('rebuild', 'rebuild');
    user[phaseName][taskName] = true;

    user[phaseName].mainTask++;

    await user.save(); 
    console.log("Task updated successfully");
  } catch (error) {
    console.log("Error updating task:", error);
  }
}


async function generateToken(tokenData, secretKey, jwt_expire) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
}

async function loginUser(req, res, send) {
  const { team, password } = req.body;
  console.log(team, password);

  const user = await findUser(team);

  if (!user) {
    console.log("user does not exist");
  } else {
    console.log(user);
    if (await bcrypt.compare(password, user.password)) {
      const tokenData = { _id: user._id, team: user.team, name: user.username };
      const token = await generateToken(tokenData, "lol", "24h");

      res.status(200).json({ status: true, token: token });
    } else {
      console.log("wrong password");
    }
  }
}

app.post('/tasks', async (req, res) => {
  const {team, phase} = req.body;
  try {
    const user = await findTeam(team);
    if (!user) {
      console.log("Team not found");
      return;
    }
    res.status(200).json({status: true, data: user})
  } catch (error) {
    console.log("Error fetching data", error);
  }
});

app.post("/appLogin", loginUser);

server.listen(3000, () => {
  console.log("Server Started");
});
