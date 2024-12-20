const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,  // Ensure the email is unique
    required: [true, 'Email is required'],  // Add validation for required field
    validate: {
      validator: async (value) => {
        const user = await mongoose.model('User').findOne({ email: value });
        return !user;  // Return true if email is unique, false otherwise
      },
      message: 'Email already exists',  // Custom error message
    },
  },
  password: String,
});

// Export the model
module.exports = mongoose.model("User", userSchema);
