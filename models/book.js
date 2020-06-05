const {Schema, model} = require('mongoose')

const book = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

book.method('toClient', function () {
    const book = this.toObject()
    book.id = book._id
    delete book._id
    return book
})

module.exports = model('Book', book)