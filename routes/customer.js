const express = require('express')
const router = express.Router();
//const Joi = require('@hapi/joi'); //input validation
const Customer = require('../model/Customer')
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');



var custArr = []

router.get('/', [authenticate, authorize], (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    let fetchedCust;
    var promise = Customer.find()
        .skip(pageSize * (currentPage - 1)).limit(pageSize)
        .exec();

    promise.then(function (customers) {
        fetchedCust = customers;
        return Customer.count()
    })
        .then(count => {
            res.status(200).json({
                message: "Customers fetched successfully!",
                customers: fetchedCust,
                TotalCustomers: count
            })
        })
        .catch(function (err) {
            return res.status(500).send(err); //must be valid 12 digit ID 
        })

})

router.get('/:id', authenticate, (req, res) => {
    console.log("id---", req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Please enter valid ID"); //must be valid 12 digit ID 
    }

    var promise = Customer.findById(req.params.id).exec();
    promise.then(function (customer) {
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send(`User with id ${req.params.id} not found.`);
        }
    })
        .catch(function (err) {
            return res.status(500).send(err); //must be valid 12 digit ID 
        });


    //callback
    // Customer.findById(req.params.id, (err, customer) => {
    //     if (err) {
    //        return res.status(400).send("Please enter valid ID"); //must be valid 12 digit ID 
    //     }
    //     if (customer) {
    //         res.json(customer);
    //     } else {
    //         res.status(404).send(`User with id ${req.params.id} not found.`);
    //     }
    // });


});

router.post('/',[authenticate, authorize] , (req, res) => {

    const id = new mongoose.Types.ObjectId();
    const custToPersist = Object.assign({
        _id: id
    }, req.body);

    const cust = new Customer(custToPersist);

    var promise = cust.save();
    promise.then(function (customer) {
        res.json(customer);
    })
        .catch(function (err) {
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
        });

    //callback
    // cust.save().then((err, student) => {
    //     if (err) {
    //         res.status(500).send(err)
    //     }
    //     res.json(cust);
    // });

});

router.put('/:id', authenticate,(req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Please enter valid ID"); //must be valid 12 digit ID 
    }

    var promise = Customer.findById(req.params.id).exec();
    promise.then(function (customer) {
        customer.name = req.body.name;
        customer.age = req.body.age;
        return customer.save()
    })
        .then(function (customer) {
            res.json(customer);
        })
        .catch(function (err) {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).send(err); //must be valid 12 digit ID  
        });

    //callback
    // Customer.findById(req.params.id, (err, student) => {
    //     if (err) res.status(500).send(err);
    //     if (student) {
    //         student.name = req.body.name;
    //         student.age = req.body.age;
    //         student.save().then((err, student) => {
    //             if (err) res.status(500).send(err);
    //             res.json(student);
    //         }); 
    //     } else {
    //         res.status(404).send(`User with id ${req.params.id} not found.`);
    //     }
    // });
});

router.delete('/:id', authenticate,(req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Please enter valid ID"); //must be valid 12 digit ID 
    }
    Customer.findByIdAndRemove(req.params.id, (err, student) => {
        if (err) res.status(500).send(err);
        res.status(200).send(`Student with id ${req.params.id} was deleted`);
    });

});


router.get('/search/detail', authenticate,(req, res) => {
    console.log('in search');

    // var promise = Customer.find({ name: 'test 3' })
    // .where('age').gte(10).lt(40)
    // .select('name age')
    // .limit(1)
    // .exec();

    //   below query contains
    //   1. Logical operator: or
    //   2. Comparison op: gte, lt
    //   3. regex: regex that matches the name starting with M
    var promise = Customer.find()
        .or([{ name: /^M/i }, { age: { $gte: 17, $lt: 50 } }])
        .limit(2)
        .exec();

    promise.then(function (customer) {
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send(`User with id ${req.params.id} not found.`);
        }
    })
        .catch(function (err) {
            return res.status(500).send(err); //must be valid 12 digit ID 
        });
});


var getSchema = () => {
    return schema = Joi.object().keys({
        id: Joi.number().integer()
    });
}
/////////////////



module.exports = router


