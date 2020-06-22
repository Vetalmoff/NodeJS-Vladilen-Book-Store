const keys = require('../keys/index')


module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Order',
        html: `
        <h1>Thank you for bying our books!</h1>
        <hr />
        <a href=${keys.BASE_URL}>Book store<a>
        `
    }
}