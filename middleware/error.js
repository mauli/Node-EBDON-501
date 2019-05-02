module.exports = (err, req, res, next) => {
    console.error("I am innnnnn**********", err);
    if (err.name === 'ValidationError') {
        var customErrorObj = [];
        for (field in err.errors) {
            customErrorObj.push({
                'key': field,
                'message': err.errors[field].message
            })
        }
        return res.status(400).json({ 'errors': customErrorObj });
    }
    return res.status(500).send(err); //must be valid 12 digit ID 
   // res.status(500).send('internal server error');
}
