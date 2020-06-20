const keys = require('../keys')


module.exports = function(email, token) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject:'Password reset!',
        html:`
        <h1>Forgot password?</h1>
        <p>If it wasn't you, just ignore this letter!</p>
        <p>If it was really you click on the link below...</p>
        <a href="${keys.BASE_URL}/auth/password/${token}">restore access</a>
        <hr />
        <a href="${keys.BASE_URL}">Our course market!</a>
        `
    }
}