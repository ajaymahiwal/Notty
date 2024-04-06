
const { Note } = require("../models/Note");
const { User } = require("../models/User");

module.exports = {
    isNoteOwner: async (req, res, next) => {
        let t_id = req.params.id;//note id
        // console.log(req.user._id);
        if (t_id.length == "65ddca84010d5c58be4398aa".length) {

            let note = await Note.findOne({ _id: t_id, created_by: `${req.user._id}` });
            // console.log(note);
            if (note) {
                next();
            } else {
                req.flash("error", "You Can't Access That Because You Are Not Owner Of That.");
                res.redirect(`/user/profile/${req.user._id}`);
            }
        } else {
            let err = new Error("Id is not vaild my dear, note not exist.")
            next(err);
        }
    },

    isOwner: async (req, res, next) => {
        let user_id = req.params.id;//user id
        if (user_id.length == "65ddca84010d5c58be4398aa".length) {

            if (user_id == `${req.user._id}`) {
                next();
            } else {
                req.flash("error", "You Can't Access That Because You Are Not Owner Of That.");
                res.redirect(`/user/profile/${req.user._id}`);
            }

        } else{
            let err = new Error("User Id Not Vaild !")
            next(err);
        }
    },

} 
