import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
    userName: { type: String, required: true },

    activityId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Activity', 
        required: true },
    createdAt: { type: Date, 
        default: Date.now }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
