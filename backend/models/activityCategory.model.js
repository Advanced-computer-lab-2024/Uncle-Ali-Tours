import mongoose from "mongoose";

const activityCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    uses: {
        type: Number,
        default: 0,
    },},
    {
    timestamp: true,
    });

    const ActivityCategory = mongoose.model('ActivityCategory', activityCategorySchema);

    export default ActivityCategory;