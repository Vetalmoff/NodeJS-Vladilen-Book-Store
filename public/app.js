document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('usd', {
        currency: 'usd',
        style: 'currency'
    }).format(node.textContent)
})