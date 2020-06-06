const toCurrency = price => {
    return new Intl.NumberFormat('usd', {
        currency: 'usd',
        style: 'currency'
    }).format(price)
}


const toDate = date => {
    return new Intl.DateTimeFormat('en-EN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})


document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.querySelector('#card')

if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'DELETE'
            }).then(res => res.json())
              .then(card => {
                if (card.books.length) {
                    const html = card.books.map( b => `
                <tr>
                    <td>${b.title}</td>
                    <td>${b.count}</td>
                    <td>
                        <button class="btn btn-small js-remove" data-id="${b.id}">
                            Delete
                        </button>
                    </td>
                </tr>
                `).join('')
                $card.querySelector('tbody').innerHTML = html
                $card.querySelector('.price').innerHTML = toCurrency(card.price)
                } else {
                    $card.innerHTML = '<p>Card is empty</p>'
                }
            })
        }
    })
}


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.autocomplete');
    let instances = M.Autocomplete.init(elems);
  });


const $searchButton = document.querySelector('#search')
const $searchInput = document.querySelector('#autocomplete-input')
const $container = document.querySelector('.container')


// $searchButton.addEventListener('click', (event) => {
//     const searchValue = $searchInput.value

//     fetch(`/search?word=${searchValue}`, {
//         method: 'get'
//     }).then(res => res.json())
//     .then(books => {
//         if (books.length) {
//             const html = books.map(b => `
//             <div class="row">
//             <div class=" cards col s6">
//             <div class="card">
//                 <div class="card-image">
//                 <img src="${b.img}" alt="${b.title}">
//                 </div>
//                 <div class="card-content">
//                 <span class="card-title">${b.title}</span>
//                 <p class="price">${toCurrency(b.price)}</p>
//                 </div>
//                 <div class="card-action actions">
//                 <a href="/books/${b.id}" target="_blank">Open book</a>
//                 <a href="/books/${b.id}/edit?allow=true" >Edit</a>
//                 <form action="/card/add" method="POST">
//                     <input type="hidden" name="id" value="${b.id}">
//                     <button type="submit" class="btn btn-primary">Buy</button>
//                 </form>
//                 </div>
//             </div>
//             </div>
//         </div>
//             `).join('')
//             $container.innerHTML = `<h1>We find this books :</h1>
//             ${html}`
//         } else {
//             $container.innerHTML = '<p>There are no books with this parameters</p>'
//         }
//     })
// })

// const $pageVal = document.querySelector('#page')
// const $go = document.querySelector('#goSearch')
// const $lastPage = document.querySelector('#lastPage')
// const $span = document.querySelector('#searchSpan')



// function validation() {
//     const page = Number($pageVal.value)
//     return (1 > page || page > +($lastPage.dataset.page)? false: true) 
// }

// $go.addEventListener('click', event => {
//     event.preventDefault()
//     const page = $pageVal.value
//     if (validation()) {
//         fetch(`/books?page=${page}&view=s&xhttp=true`, {
//             method: 'get'
//         })
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
//             const html = data.books.map(b => `
//             <div class="row">
//             <div class="col s6">
//             <div class="card">
//                 <div class="card-image">
//                 <img src="${b.img}" alt="${b.title}">
//                 </div>
//                 <div class="card-content">
//                 <span class="card-title">${b.title}</span>
//                 <p class="price">${toCurrency(b.price)}</p>
//                 </div>
//                 <div class="card-action actions">
//                 <a href="/books/${b.id}" target="_blank">Open book</a>
//                 <a href="/books/${b.id}/edit?allow=true" >Edit</a>
//                 <form action="/card/add" method="POST">
//                     <input type="hidden" name="id" value="${b.id}">
//                     <button type="submit" class="btn btn-primary">Buy</button>
//                 </form>
//                 </div>
//             </div>
//             </div>
//         </div>`).join('')
//             $container.innerHTML = html
//         })
//     } else {
//         $span.innerHTML = "page doesn't exist"
//     }
// })


// const $two = document.querySelector('#two')
// const $three = document.querySelector('#three')
// const $four = document.querySelector('#four')


// $two.addEventListener('click', (event) => {
//     const $cards = document.querySelectorAll('.cards')
//     console.log(($cards))
//     $cards.forEach(c => (c.className = 'cards col s12 m12 l6 xl6'))
// })

// $three.addEventListener('click', (event) => {
//     const $cards = document.querySelectorAll('.cards')
//     console.log(($cards))
//     $cards.forEach(c => (c.className = 'cards col s12 m6 l4 xl4'))
// })

// $four.addEventListener('click', (event) => {
//     const $cards = document.querySelectorAll('.cards')
//     console.log(($cards))
//     $cards.forEach(c => (c.className = 'cards col s12 m6 l3 xl2'))
// })


// const url = {
//     page: +$pageVal.value
// }

M.Tabs.init(document.querySelectorAll('.tabs'))