const keys = require('../keys')


module.exports = function(email) {
    return{
        to: email,
        from: keys.EMAIL_FROM,
        subject:'account has been created!',
        html:`
        <h1>Welcome to our market!</h1>
        <p>You have succesfully created your account with email: ${email}</p>
        <hr />
        <a href="${keys.BASE_URL}">Our course market!</a>
        `
    }
}