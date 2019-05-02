const mongoose = require('mongoose');

//BUILT IN VALIDATOR: name, age, paymenttype are examples
//CUSTOM VALIDATOR: phone
//ASYNC VALIDATORS: used when the validation logic involves http call/db read/file system read and is time taking
//by default validators are syncronous
//VALIDATION ERRORS: handled in post catch block
//SCHEMA TYPES: SchemaTypes handle definition of path defaults, validation, getters, setters, field selection defaults for queries, and other general characteristics for Mongoose document properties.
const CustSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String, 
        required: true, 
        lowercase: true,
        trim: true
    },
    age: { 
        type: Number, 
        required: true, 
        min: 18, 
        max: 100,
        get: (value) => {
            return value + ' years'
        }
    },
    paymentType: { 
        type: String,
        required: true,
        enum: ['CASH', 'CARD']
    },
    phone: {
        type: String,
        /*  validate: { //sync validator
            validator: function(ph) {
              return /\d{3}-\d{3}-\d{4}/.test(ph);
            },
            message: props => `${props.value} is not a valid phone number! Format is xxx-xxx-xxxx`
          }, */
        validate: { //async validator
            isAsync: true,
            validator: function (v, callback) { 
                setTimeout(function () {
                    var phoneRegex = /\d{3}-\d{3}-\d{4}/;
                    var msg = v + ' is not a valid phone number! Format is xxx-xxx-xxxx';
                    callback(phoneRegex.test(v), msg); //An asynchronous validator needs to accept a second parameter that's the callback it must call to deliver the boolean result of the validation.
                }, 1000);
            },
        },
        required: [true, 'Phone Number is required field']

    }},
    {
        timestamps: true
    });


CustSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Customer', CustSchema);

