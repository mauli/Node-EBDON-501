const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//BUILT IN VALIDATOR: name, age, paymenttype are examples
//CUSTOM VALIDATOR: phone
//ASYNC VALIDATORS: used when the validation logic involves http call/db read/file system read and is time taking
//by default validators are syncronous
//VALIDATION ERRORS: handled in post catch block
//SCHEMA TYPES: SchemaTypes handle definition of path defaults, validation, getters, setters, field selection defaults for queries, and other general characteristics for Mongoose document properties.
const UserSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String, 
        required: true, 
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    role: {
        enum: ['ADMIN', 'USER']
    }},
    {
        timestamps: true
    });

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ role: this.role, _id: this.id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
    )
    return token

}
UserSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('User', UserSchema);

