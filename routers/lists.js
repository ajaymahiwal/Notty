

const express = require("express");
const router = express.Router({ mergeParams: true });
const { Note } = require("../models/Note");
const { User } = require("../models/User");
const wrapAsync = require("../middlewares/wrapAsync");



router.post("/data",wrapAsync(async (req, res) => {

    let { name } = req.body;
    console.log("user want this list info",req.body.name);
    if(name){
        name = name.toLowerCase();
    // let idx = q.charAt(q.length - 1); //idx is now string 
    // let listIdx = parseInt(idx); //converted string into number
    // let name = req.user.lists[listIdx];
    // console.log(name)

    let data = await Note.find({ list: `${name}`, created_by: `${req.user._id}` });
    console.log(data);
    // console.log(JSON.stringify(data));
    res.json(data);

    /*
    res.json({
        name:"AjayMahiwal",
        name1:"AjayMahiwal",
    })
    */
    }else{
        // req.flash("error","Something Went Wrong When You Are Requesting List.");
        // res.redirect("/dashboard");
        res.json({msg:"body have no data."})
    }
    
}));

router.get("/search/data", async (req, res) => {
    let { q } = req.query;
    // console.log(q);
    // console.log(req.user);
    let data = req.user.lists.filter((l) => {
        return l.includes(q.toLowerCase());
    });
    // console.log(data);
    let d = await Note.find({ list: `${data[0]}`, created_by: `${req.user._id}` });
    d.push(data[0]); //searching list name
    console.log(d);
    res.json(JSON.stringify(d));

    // res.json(JSON.stringify({
    //     "name":"AJay"
    // }))
})



router.get("/new", async (req, res) => {
    let user = await User.findById(req.user._id).populate("notes");
    let notes = user.notes;
    res.render("./note/createList", { notes });
})
router.post("/new", async (req, res) => {
    let { list, listData } = req.body;

    if (req.user.lists.includes(list.name.toLowerCase())) {
        req.flash("error", `${list.name} List Name is Already exits, choose some other name.`)
        res.redirect("/lists/new");
    }
    else {
        console.log(list);
        console.log(listData);
        list.name = list.name.toLowerCase();
        let updatedUser = await User.findByIdAndUpdate(req.user._id, {
            lists: [...req.user.lists, list.name],
        }, { new: true, runValidators: true });

        for (let key in listData) {
            let t_id = listData[key];
            let note = await Note.findById(t_id);
            let t = await Note.findByIdAndUpdate(t_id, { list: [...note.list, list.name] })
        }
        res.redirect("/dashboard");
    }
})

router.get("/edit", async (req, res) => {
    console.log(req.query);
    let { listName } = req.query;
    if (listName) {
        if (!req.user.lists.includes(listName)) {
            req.flash("error", `Which list you want to edit,${listName} that does not exists.`);
            res.redirect("/dashboard");
        }
        else{
            console.log("listName:", listName);
        let listNotes = await Note.find({ list: listName, created_by: `${req.user._id}` });
        let noteListName = [];
        listNotes.forEach((el) => { // getting only the note name which have list name => listName
            noteListName.push(el.name);
        })
        console.log(noteListName);
        let user = await User.findById(req.user._id).populate("notes");
        console.log(user._id);
        res.render("./note/editList", { noteListName, listName, user });
        }
    } else {
        req.flash("error", "List Name Is Not Vaild So, Please Try Again Later !!");
        res.redirect("/dashboard");
    }
    // res.redirect("/dashboard");
});

router.put("/edit/name", async (req, res) => {
    let { newListName, oldListName } = req.body;
    console.log(oldListName);
    console.log(newListName);
    oldListName = oldListName.toLowerCase();
    newListName = newListName.toLowerCase();

    if (req.user.lists.includes(newListName)) {
        req.flash("error", `${newListName} List Name is Already exits, choose some other name.`)
        res.redirect(`/lists/edit?listName=${oldListName}`);
    }
    else {
        let userLists = req.user.lists;
        userLists.splice(userLists.indexOf(oldListName), 1, newListName);//replace 
        await User.findByIdAndUpdate(req.user._id, { lists: [...userLists] });

        let notesWithOldListName = await Note.find({ list: oldListName, created_by: `${req.user._id}` });
        if (notesWithOldListName) {
            notesWithOldListName.forEach(async (obj) => {
                let note = await Note.findById(obj._id);
                let newList = [...note.list];
                newList.splice(newList.indexOf(`${oldListName}`), 1, `${newListName}`);
                await Note.findByIdAndUpdate(obj._id, { list: [...newList] });
            });
        }
        res.redirect(`/lists/edit?listName=${newListName}`);
    }
});
router.put("/edit/notes/new", async (req, res) => {

    let { noteData } = req.body;
    let { listName } = req.query;
    listName = listName.toLowerCase();



    if (noteData) {
        noteData.forEach(async (id) => {
            let note = await Note.findById(id);
            let newList = [...note.list];
            // if (newList.includes(listName)) {
            //     newList.splice(newList.indexOf(`${oldListName}`), 1, `${listName}`);
            // }
            // // else{
            // //     newList.
            // // }
            newList.push(listName);
            await Note.findByIdAndUpdate(id, { list: [...newList] });
        });
    }




    // let newList = [...req.user.lists];
    // if (!newList.includes(listName)) {
    //     newList.splice(newList.indexOf(`${oldListName}`), 1, `${listName}`);
    //     await User.findByIdAndUpdate(req.user._id, { lists: [...newList] });
    // }

    res.redirect(`/lists/edit?listName=${listName}`);
    // }

});
router.delete("/delete", async (req, res) => {
    console.log(req.body);
    let { listName } = req.body;

    let newList = req.user.lists.filter((l) => {
        return l != listName;
    });
    // console.log(newList);
    let upUser = await User.findByIdAndUpdate(req.user._id, { lists: [...newList] });
    let listNotes = await Note.find({ list: listName, created_by: `${req.user._id}` });

    listNotes.forEach(async (element) => {
        let newL = element.list.filter((l) => {
            return l != listName;
        });
        await Note.findByIdAndUpdate(element._id, { list: [...newL] });
        // console.log(await Note.findById(element._id));
    });

    // console.log(upUser);
    res.redirect("/dashboard");
});

router.delete("/edit/notes/:noteId", async (req, res) => {
    let { listName} = req.body;
    let { noteId } = req.params;
    let note = await Note.findById(noteId);
    let newList = note.list.filter((el) => {
        return el != listName;
    });
    await Note.findByIdAndUpdate(noteId, { list: [...newList] });
    res.redirect(`/lists/edit?listName=${listName}`);
});


module.exports = router;