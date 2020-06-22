const keys = require('../keys/index')


module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Restoration password',
        html: `
        <h1>Forgot your password?</h1>
        <p>If not, ignore this message</p>
        <p>otherwise click the link below </p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Restore acces</a></p>
        <hr />
        <a href=${keys.BASE_URL}>Book store<a>
        `
    }
}