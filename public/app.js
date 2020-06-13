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


const $searchButton = document.querySelector('#search')
const $searchInput = document.querySelector('#autocomplete-input')
const $container = document.querySelector('.container')

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
