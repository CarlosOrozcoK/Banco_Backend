import { Schema, model } from "mongoose";

const ServiceSchema = new Schema({
    name: {
        type: String,
        require: true
    },
   
    description: {
        type: String,
        require: true
    },
    
    status: {
        type: Boolean,
        default: true
    }
}, {
     timestamps: true,
     versionKey: false
});

export default model("Service", ServiceSchema);