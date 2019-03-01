const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    name: String,
    diet: String,
    recipes: [Schema.Types.Mixed],
    notes: [String],
    excludedIngredients: [String],
    mealPlans: Schema.Types.Mixed,
    ratings: Schema.Types.Mixed,
    onhandIngredients: [Schema.Types.Mixed],
    groceryLists: [Schema.Types.Mixed]
});

mongoose.model('users', userSchema)
