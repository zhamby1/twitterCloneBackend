const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String}
})

//before we save we have to hash or encrypt our password before creating a new user
//create a method/function that is going to encrpt this password upon a new user

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//compare passwords...because we are encrypted it is easier to stick this function in the model file
UserSchema.methods.comparePasswords = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
    
}

module.exports = mongoose.model('User', UserSchema)


