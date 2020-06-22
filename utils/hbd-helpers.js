
module.exports = {
    ifeq(a, b, options) {


        //console.log(this)

        if (a.toString() === b.toString()) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    }
}