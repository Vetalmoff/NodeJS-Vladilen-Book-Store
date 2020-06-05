const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count:{
                    type: Number,
                    require: true,
                    default: 1
                },
                bookId: {
                    required: true,
                    type: Schema.Types.ObjectId,
                    ref: 'Book'
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(book) {
    const items = [...this.cart.items]
    const idx = items.findIndex(b => b.bookId.toString() === book._id.toString())

    console.log('items : ', items, 'index :',idx)
    if (idx >= 0) {
        items[idx].count += 1
    } else {
        items.push({
            bookId: book._id,
            count: 1
        })
    }
    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(b => {
        console.log(b.bookId.toString())
        return b.bookId.toString() === id.toString()
    })

    console.log('idx = ', idx)
    console.log('items = ', items)

    if (items[idx].count === 1) {
        items = items.filter(b => b.bookId.toString() !== id.toString())
        console.log('last items = ', items)
    } else {
        items[idx].count--
    }
    
    this.cart = {items}
    return this.save()

} 

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)