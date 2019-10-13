var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'password must has more than 6 characters.']
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    },
    profilePicture: Buffer,
    created: { 
        type: Date,
        default: Date.now
    }
});

// hash user password before saving into database
userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;