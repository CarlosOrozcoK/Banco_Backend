import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        require: true
    },
   
    description: {
        type: String,
        require: true
    },
    
    category: {
        type: String,
        require: true
    },
    
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Product", ProductSchema);