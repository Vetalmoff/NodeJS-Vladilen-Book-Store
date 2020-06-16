
module.exports = function(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const sort = req.query.sort
        let mySort = {}

        switch (sort) {
            case 'cheaperFirst': mySort = {price: 1}
                break
            case 'expenciveFirst': mySort = {price: -1}
                break
            case 'byAlphabet': mySort = {title: 1}
                break
            default: break
        }

        console.log('sort = ', mySort)
         

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        // model.find().sort(mySort).limit(limit).skip(startIndex).toArray(function(err, res) {
        //     if (err) throw err;
        //     console.log('toArray res1 = ', res);
        // })
        
        try {
            results.results = await model.find().sort(mySort).limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({message: e.message})
        }

    }
}