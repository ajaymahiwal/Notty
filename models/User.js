
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Note } = require("./Note");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'note'
        }
    ],
    lists: [
        {
            type: String,
        },
    ],
    image: {
        type: String,
        default:
            "https://img.freepik.com/free-vector/cute-happy-smiling-child-isolated-white_1308-32243.jpg",
        set: (v) =>
            v === ""
                ? "https://img.freepik.com/free-vector/cute-happy-smiling-child-isolated-white_1308-32243.jpg"
                : v,
    },
    dob:{
        type:Date,
    },
    gender:{
        type:String,
    },
    contact_num:{
        type:String,
    },
    bio:{
        type:String,
    },
    google_id:{
        type:String,
    }
});

userSchema.post("findOneAndDelete", async (user) => {
    if (user.notes.length) {
        let data = await Note.deleteMany({ _id: { $in: user.notes } });
        console.log("Data Information about notes deleted of user", data);
    }
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);



module.exports = { User };