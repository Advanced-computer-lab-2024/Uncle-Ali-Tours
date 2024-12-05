import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useActivityStore } from '../store/activity';
import { useUserStore } from '../store/user';

const BookMark = () => {
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
    const {user} = useUserStore();
    const { getBookmarkedActivities } = useActivityStore();

    const fetchBookmarkedActivities = async (userName) => {
        try {
            const bookmarks = await getBookmarkedActivities(userName);
            setBookmarkedActivities(Array.isArray(bookmarks) ? bookmarks : []);
        } catch (error) {
            toast.error('An error occurred while fetching bookmarked activities.');
            console.error('Error fetching bookmarked activities:', error);
        }
    };

    useEffect(() => {
        if(user.userName){
        fetchBookmarkedActivities(user.userName);
        }
    }, [user.userName]);

    if (bookmarkedActivities.length === 0) {
        return <div>No bookmarked activities found.</div>; // Show message if no bookmarks
    }
else{
    return (
        
        <div className="p-4">
            {bookmarkedActivities.map((activity) => (
                <div
                    key={bookmarkedActivities._id}
                    className="relative mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300"
                >
                    <h3 className="text-lg font-bold">{activity.activityId.name}</h3>
                    <p>Date: {new Date(activity.activityId.date).toLocaleDateString()}</p>
                    <p>Location: {activity.activityId.location?.coordinates?.join(', ') || "Not available"}</p>
                    <p>Price: ${activity.activityId.price}</p>
                    <p>Category: {activity.activityId.category}</p>
                    <p>Tags: {activity.activityId.tags?.join(', ') || "No tags"}</p>
                    <p>Special Discounts: {activity.activityId.specialDiscounts || "None"}</p>
                    <p>Booking Open: {activity.activityId.bookingOpen ? "Yes" : "No"}</p>
                    <p>Creator: {activity.activityId.creator}</p>
                    <p>Average Rating: {activity.activityId.rating} (from {activity.activityId.numReviews} reviews)</p>
                </div>
            ))}
        </div>
    );}
}

export default BookMark;
