const mongoose=require("mongoose")
const LeadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    area: {
        type: String,
    },
    pincode: {
        type: String,
    },
    property_type: {
        type: String,
    },
    no_of_bedrooms: {
        type: String,
    },
    Price: {
        type: Number,
    },
    contact: {
        type: String,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model("Lead", LeadSchema);
