const mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    phone:      { type: String, default: null },
    username:   { type: String, default: null  },
    name:       { type: String, default: null  },
    lastname:   { type: String, default: null  },
    verified:   { type: Boolean, default: false },
    password:   { type: String, default: null },
    token:      { type: String, default: null },
    verifyToken: { type: String, default: null },
    forgotToken: { type: String, default: null },
    phoneToken: { type: String, default: null }
},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true 
    }
});

userSchema.virtual('picture').get( function(){

    return `https://i.pravatar.cc/300?${this._id}`;

});


module.exports = mongoose.model('User', userSchema);


