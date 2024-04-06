const { Note } = require("../models/Note");
const { User } = require("../models/User");






module.exports.index = async (req, res) => {
    console.log(req.user);
    // let u = req.user;
    let user = await User.findById(req.user._id).populate('notes');
    res.render("./note/notes.ejs", { user });
}

module.exports.getNewNotePage = (req, res) => {
    res.render("./note/new.ejs");
}


module.exports.postNewNote = async (req, res) => {
    let { note, listData } = req.body;
    note.name = note.name.toLowerCase();

    let isNoteNameUnique = await Note.findOne({ name: `${note.name}`, created_by: `${req.user._id}` });
    //ager us naam ka note huaa us user k pass to isNoteNameUnique mein vo note object aa jayega
    if (isNoteNameUnique) {
        //yani jab vo already us naam ka note us user k pass hai tab
        req.flash("error", `You have already a note with ${note.name} name ! So please choose some other name for note :)`);
        res.redirect("/notes/new");
    }
    else {
        let phone_no = req.user.contact_num ? req.user.contact_num : null;


        if (!listData) {
            listData = [];
        }
        note.list = listData;
        note.created_by = req.user._id;
        note.created_at = Date.now();
        
        console.log(note.created_at)
        let newnote = new Note({ ...note });
        await newnote.save();

        await User.findByIdAndUpdate(req.user._id, {
            notes: [...req.user.notes, newnote._id],
        }, { new: true, runValidators: true });

 

        res.redirect(`/notes/${newnote._id}`);
    }

}


module.exports.getNote = async (req, res) => {
    let id = req.params.id;

    let note = await Note.findById(id);
    if (note) {
        res.render("./note/shownote", { note });
    }else {
        throw new Error("Note Not found");
    }
}

module.exports.getEditNotePage = async (req, res) => {
    let id = req.params.id;
    let note = await Note.findById(id);
    if (note) {
        res.render("./note/edit", { note });
    }else {
        throw new Error("Note Not found");
    }
}


module.exports.editNote = async (req, res) => {
    let id = req.params.id;
    let { note, listData, isNoteNameChanged } = req.body;

    console.log(note);
    console.log(listData);



    let isNoteNameUnique = false;
    if (!isNoteNameChanged) {// note name changed hai to check ker rhe hai already exist or not
        note.name = note.name.toLowerCase();
        isNoteNameUnique = await Note.findOne({ name: `${note.name}`, created_by: `${req.user._id}` });
    }//ager noteName changed nhi hai yani same hai to hme ye nhi khna hai ki note k liye koi dusra naam rakho, ho skta hai user sirf date ya description change kerna chata ho

    if (isNoteNameUnique) {
        //yani jab vo already us naam ka note us user k pass hai tab
        req.flash("error", `You have already a note with ${note.name} name ! So please choose some other name for note :)`);
        res.redirect(`/notes/${id}/edit`);
    }
    else {
        let oldSavedNote = await Note.findById(id);
        // let newL = [...oldSavedNote.list];


     


        if (!listData) {
            listData = [];
        }
   
        let newNote = await Note.findByIdAndUpdate(id, { ...note, list: [...listData] }, { new: true, runValidators: true });
        await newNote.save();
        console.log("Updated Note", newNote);

        res.redirect(`/notes/${id}`);
    }
}



module.exports.deleteNote = async (req, res) => {
    let id = req.params.id;
    let delNote = await Note.findByIdAndDelete(id);
    console.log("note deleted", delNote);
    let newNote = req.user.notes.filter((t) => t != id)
    await User.findByIdAndUpdate(req.user._id, { notes: [...newNote] });
    req.flash("success", `${delNote.name.toUpperCase()} Note Is Deleted Successfully !`);
    res.redirect("/notes");
}


module.exports.editNoteCompleted = async (req, res) => {
    let { id } = req.params;
    let note = await Note.findById(id);
    note.completed = !note.completed;
    let up = await Note.findByIdAndUpdate(id, { ...note }, { new: true, runValidators: true });
    console.log(up);

    res.redirect(`/notes/${id}`);
}