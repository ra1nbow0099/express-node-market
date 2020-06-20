module.exports = {
    ifeq (a, b, options) {
        if(a==b) {
        return options.fn(this)
        }
        return options.inverse(this)
    }
}
// кнопка edit на курсе видна только пользователю который создал данный курс