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

    static async search(searchParams) {
        const books = await Book.getAll()
        const searchBooks = books.filter(b => b.title.toLowerCase().match(searchParams.toLowerCase()))

        if (searchBooks) {
            return searchBooks
        } else {
            return []
        }
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


    static async pagination(query) {
        const books = await this.getAll()
        const page = +query.page
        const limit = 4
        const result = {}
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        books.sort((a, b) => a.price - b.price)
        
        result.books = books.slice(startIndex, endIndex)

        if (endIndex < books.length)
        result.next = {
            page: page + 1
        }

        if (startIndex > 0)
        result.previous = {
            page: page - 1
        }

        result.first = {
            page: 1
        }

        if (books.length % limit === 0) {
            result.last = {
                page: Math.floor(books.length / limit)
                }
        } else {
            result.last = {
                page: Math.floor(books.length / limit) + 1
            }
        }
        

        result.page = page

        switch (query.view) {
            case 's': result.view = {
                alias: 's',
                body: 'col s12 m6 l4 xl3'
            }
                break
            case 'm': result.view = {
                alias: 'm',
                body: 'col s12 m4 l3 xl2'
            }
                break
            case 'l': result.view = {
                alias: 'l',
                body: 'col s12 m3 l2 xl1'
            }
                break
            default: 
                break
        }

        

        return result
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
