const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    name: String,
    recipes: [Schema.Types.Mixed],
    notes: [String],
    excludedIngredients: [String],
    ratings: Schema.Types.Mixed,
});

mongoose.model('users', userSchema)