
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../middlewares/wrapAsync");
const {isNoteOwner} = require("../middlewares/isOwner");

// const notesControllers = require("../controllers/copyOfNote");
const notesControllers = require("../controllers/notesControllers");



//Note -  CRUD operations
router.get("/", wrapAsync(notesControllers.index));

router.get("/new",notesControllers.getNewNotePage);

router.post("/new", wrapAsync(notesControllers.postNewNote));

router.get("/:id",isNoteOwner,wrapAsync(notesControllers.getNote));

router.get("/:id/edit",isNoteOwner,wrapAsync(notesControllers.getEditNotePage));

router.put("/:id",isNoteOwner,wrapAsync(notesControllers.editNote));

router.put("/:id/completed",isNoteOwner,wrapAsync(notesControllers.editNoteCompleted));

router.delete("/:id",isNoteOwner,wrapAsync(notesControllers.deleteNote));




module.exports = router;