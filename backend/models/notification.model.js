import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
	userName: {
		type: String, 
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	link: {
		type: String,
	},
	read: {
		type: Boolean,
		default: false,
	},
},
	{
	timestamps: true,
	});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
