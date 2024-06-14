const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    isLeader: {
        type: Boolean,
        required: true
    }
})

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: (true, "Please enter the team name")
    },
    phaseOne: {
        taskOne: {
            type: Boolean,
            required: true
        },
        taskTwo: {
            type: Boolean,
            required: true
        },
        taskThree: {
            type: Boolean,
            required: true
        },
        time: {
            type: Number,
            required: true

        },
        totalTime: {
            type: Number,
            required: true
        }

    },

    phaseTwo: {
        taskOne: {
            type: Boolean,
            required: true
        },
        taskTwo: {
            type: Boolean,
            required: true
        },
        taskThree: {
            type: Boolean,
            required: true
        },
        time: {
            type: Number,
            required: true

        },
        totalTime: {
            type: Number,
            required: true
        }

    },

    phaseThree: {
        taskOne: {
            type: Boolean,
            required: true
        },
        taskTwo: {
            type: Boolean,
            required: true
        },
        taskThree: {
            type: Boolean,
            required: true
        },
        time: {
            type: Number,
            required: true

        },
        totalTime: {
            type: Number,
            required: true
        }

    },

    phaseFour: {
        taskOne: {
            type: Boolean,
            required: true
        },
        taskTwo: {
            type: Boolean,
            required: true
        },
        taskThree: {
            type: Boolean,
            required: true
        },
        time: {
            type: Number,
            required: true

        },
        totalTime: {
            type: Number,
            required: true
        }

    }
})

module.exports = {
    Team: mongoose.model('Team', teamSchema),
    User: mongoose.model('User', userSchema)
};