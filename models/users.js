const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({
    team: {
        type: String,
        required: (true, "Please enter the team name")
    },
    username: {
        type: String,
        required: (true, "Please enter you username")
    },
    email: {
        type: String,
        required: (true, "Please enter your email address")
    },
    password: {
        type: String,
        required: (true, "Please enter your password")
    },
    members: [{
        type: String
    }],
    isLeader: {
        type: Boolean,
        required: true
    }

})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: (true, "Please enter you username")
    },
    email: {
        type: String,
        required: (true, "Please enter your email address")
    },
    password: {
        type: String,
        required: (true, "Please enter your password")
    },
    isLeader: {
        type: Boolean,
        required: true
    },
    team: {
        type: String,
        required: (true, "Please enter the team name")
    }

})

module.exports = {
    Leader: mongoose.model('Leader', leaderSchema),
    User: mongoose.model('User', userSchema)
};