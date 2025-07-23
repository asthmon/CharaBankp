const Waifulocation = require('../models/waifuground');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res, next) => {
    const waifulocations = await Waifulocation.find({})
    res.render('waifuLocations', { datas: waifulocations })
}

module.exports.renderNewForm = (req, res) => {
    res.render('new')
}

module.exports.createChara = async (req, res, next) => {
    const character = new Waifulocation(req.body.waifulocation)
    character.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    character.author = req.user._id;
    await character.save();
    console.log(character)
    req.flash('success', 'Successfuly Add New Character!!');
    res.redirect(`/waifulocations/${character._id}`)
}

module.exports.showData = async (req, res, next) => {
    const waifulocation = await Waifulocation.findById(req.params.id)
        .populate({ path: 'comments', populate: { path: 'author' } }).populate('author');
    if (!waifulocation) {
        req.flash('error', 'Cannot Find Item / Item Has Been Deleted');
        return res.redirect('/waifulocations')
    }
    res.render('showdetails', { data: waifulocation })
}

module.exports.renderEditForm = async (req, res) => {
    const waifulocation = await Waifulocation.findById(req.params.id)
    if (!waifulocation) {
        req.flash('error', 'Cannot Find Item / Item Has Been Deleted');
        res.redirect('/waifulocations')
    }
    res.render('edit', { data: waifulocation })
}

module.exports.updateData = async (req, res) => {
    const { id } = req.params;
    const waifulocation = await Waifulocation.findByIdAndUpdate(id, { ...req.body.waifulocation })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    waifulocation.images.push(...images);
    await waifulocation.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await waifulocation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(waifulocation)
    }
    req.flash('success', 'Successfully Updated Item!!')
    res.redirect(`/waifulocations/${waifulocation._id}`)
}

module.exports.deleteData = async (req, res) => {
    const { id } = req.params;
    await Waifulocation.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Item!!')
    res.redirect('/waifulocations');
}
