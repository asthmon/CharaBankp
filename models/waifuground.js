const mongoose = require('mongoose');

const Comment = require('./comment')
const Schema = mongoose.Schema;


const ImageSchema = new Schema({

    url: String,
    filename: String

})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const WaifulocationSchema = new Schema({
    name: String,
    images: [ImageSchema],
    age: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});


WaifulocationSchema.post('findOneAndDelete', async function (dat) {
    if (dat) {
        await Comment.deleteMany({
            _id: {
                $in: dat.comments
            }
        })
    }
})

module.exports = mongoose.model('Waifulocation', WaifulocationSchema);