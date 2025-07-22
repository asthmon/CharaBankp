const express = require('express');
const router = express.Router({ mergeParams: true });
const waifulocations = require('../controllers/characters')
const catchAsync = require('../utils/asyncErrorhandler');
const Waifulocation = require('../models/waifuground');
const { isLoggedIn, validateData, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })
// const methodOverride = require('method-override');
// router.use(methodOverride('_method'))



router.route('/')
    .get(catchAsync(waifulocations.index))
    //Make new Item
    .post(isLoggedIn, upload.array('image'), validateData, catchAsync(waifulocations.createChara))
// .post(upload.array('image'), (req, res) => {
//     const images = req.files;
//     console.log(images.map(f => ({ url: f.path, filename: f.filename })));
//     res.send('It worked!!')
// })

//Make new Item Form
router.get('/new', isLoggedIn, waifulocations.renderNewForm)

router.route('/:id')
    //Show Detail
    .get(catchAsync(waifulocations.showData))
    //Item Edit
    .put(isLoggedIn, isAuthor, upload.array('image'), validateData, catchAsync(waifulocations.updateData))
    //Delete Item
    .delete(isLoggedIn, isAuthor, catchAsync(waifulocations.deleteData))

//Item Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(waifulocations.renderEditForm))

router



router


module.exports = router;