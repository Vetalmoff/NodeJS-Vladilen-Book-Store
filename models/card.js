const path = require('path')
const fs = require('fs')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)


class Card {

    static async add(book) {
        const card = await Card.fetch()

        const idx = card.books.findIndex(b => b.id === book.id)
        const candidate = card.books[idx]
        
        if (candidate) {
            candidate.count++
            card.books[idx] = candidate
        } else {
            book.count = 1
            card.books.push(book)
        }

        card.price += +book.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject (err)
                } else {
                    resolve()
                }
            })
        })
    }


    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) {
                    reject (err)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    }

}


module.exports = Card