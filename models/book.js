const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

class Book {
    constructor(title, price, img) {
        this.title = title,
        this.price = price,
        this.img = img,
        this.id = uuidv4()
    }

    toJson() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const books = await Book.getAll()
        books.push(this.toJson())

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'books.json'), JSON.stringify(books), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            } )
        })

    }

    static async update(book) {
        const books = await Book.getAll()

        const idx = books.findIndex(b => b.id ===  book.id)
        books[idx] = book

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'books.json'), JSON.stringify(books), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            } )
        })

    }



    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'books.json'), (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }

            })
        })
        
    }

    static async getById(id) {
        const books = await Book.getAll()
        return books.find(b => b.id === id)
    }
}

module.exports = Book
