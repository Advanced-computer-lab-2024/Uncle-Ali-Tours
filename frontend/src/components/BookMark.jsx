import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BookMark = () => {
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);

    const fetchBookmarkedActivities = async () => {
        try {
            const response = await fetch('/api/activity/bookmarkedActivities');
            const data = await response.json();
            if (data.success) {
                setBookmarkedActivities(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch bookmarked activities.');
            }
        } catch (error) {
            toast.error('An error occurred while fetching bookmarked activities.');
            console.error('Error fetching bookmarked activities:', error);
        }
    };

    useEffect(() => {
        fetchBookmarkedActivities();
    }, []);

    return (
        <div className="p-4">
            {bookmarkedActivities.map((activity) => (
                <div
                    key={activity._id}
                    className="relative mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300"
                >
                    <h3 className="text-lg font-bold">{activity.name}</h3>
                    <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                    <p>Location: {activity.location?.coordinates?.join(', ') || "Not available"}</p>
                    <p>Price: ${activity.price}</p>
                    <p>Category: {activity.category}</p>
                    <p>Tags: {activity.tags?.join(', ') || "No tags"}</p>
                    <p>Special Discounts: {activity.specialDiscounts || "None"}</p>
                    <p>Booking Open: {activity.bookingOpen ? "Yes" : "No"}</p>
                    <p>Creator: {activity.creator}</p>
                    <p>Average Rating: {activity.rating} (from {activity.numReviews} reviews)</p>
                </div>
            ))}
        </div>
    );
}

export default BookMark;
