const keys = require('../keys/index')

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'account was created',
        html: `
        <h1>Welcome</h1>
        <p>you successfully was created new account with this email : ${email}</p>
        <hr />
        <a href=${keys.BASE_URL}>Book store<a>
        `
    }
}