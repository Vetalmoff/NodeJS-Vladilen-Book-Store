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
            const csrf = event.target.dataset.csrf

            fetch('/cart/remove/' + id, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrf
                }
            }).then(res => res.json())
              .then(card => {
                if (card.books.length) {
                    const html = card.books.map( b => `
                <tr>
                    <td>${b.title}</td>
                    <td>${b.count}</td>
                    <td>
                        <button class="btn btn-small js-remove" data-id="${b.id}" data-csrf="${csrf}">
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


M.Tabs.init(document.querySelectorAll('.tabs'))







const pas = document.querySelector('#rpassword')
const rePas = document.querySelector('#confirm')
const errRegDisp = document.querySelector('#error-reg-disp')
const regBtn = document.querySelector('#register-btn')

if (rePas) {
    rePas.addEventListener('blur', () => {
        if (pas.value !== rePas.value) {
            errRegDisp.innerHTML = "passwords don't match"
            regBtn.disabled = true
        } else {
            errRegDisp.innerHTML = ""
            regBtn.disabled = false
        }
    })
}


const $searchButton = document.querySelector('#search')
const $searchInput = document.querySelector('#autocomplete-input')
const $container = document.querySelector('.container')

if ($searchButton) {
    $searchButton.addEventListener('click', (event) => {
        const csrf = event.target.dataset.csrf

        fetch(`/search?title=${$searchInput.value}`, {
            method: 'GET',
            headers: {
            }
        })
          .then(res => res.json())
          .then(ses => {
              console.log(ses.books)
              if (ses.books.length) {
                  let htmlBooks = `
                    <h2>We found these books for you : </h2>
                    <div class="row">`
                  if (ses.isAuthenticated) {
                    htmlBooks += ses.books.map(book => 
                        `<div class="col s12 m6 l4 xl4">
                        <div class="card">
                            <div class="card-image">
                                <img src="${book.img}" alt="${book.title}">
                            </div>
                            <div class="card-content">
                                    <div class="card-title">${book.title}</div>
                                <p class="price">${book.price}</p>
                            </div>
                            <div class="card-action actions">
                                <a href="/books/${book._id}" target="_blank">Open book</a>
                                <a href="/books/${book._id}/edit?allow=true" >Edit</a>
                                <form action="/cart/add" method="POST">
                                    <input type="hidden" name="id" value="${book._id}">
                                    <button type="submit" class="btn btn-primary">Buy</button>
                                    <input type="hidden" name="_csrf" value="${csrf}">
                                </form>
                            </div>
                        </div>
                    </div>
                          `
                      ).join('')
                        $container.innerHTML = htmlBooks
                  } else {
                    htmlBooks += ses.books.map(book => 
                        `<div class="col s12 m6 l4 xl4">
                        <div class="card">
                            <div class="card-image">
                                <img src="${book.img}" alt="${book.title}">
                            </div>
                            <div class="card-content">
                                    <div class="card-title">${book.title}</div>
                                <p class="price">${book.price}</p>
                            </div>
                            <div class="card-action actions">
                                <a href="/books/${book._id}" target="_blank">Open book</a>
                            </div>
                        </div>
                    </div>
                          `
                      ).join('')
                        $container.innerHTML = htmlBooks
                  }
                 
              } else {
                  $container.innerHTML = '<h1>No matches found</h1>'
              }
          })
    })
}   


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.tooltipped')
    let instances = M.Tooltip.init(elems)
  })

const $limit1 = document.querySelector('#limit1')
const $limit2 = document.querySelector('#limit2')
const $limit3 = document.querySelector('#limit3')

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);
  });