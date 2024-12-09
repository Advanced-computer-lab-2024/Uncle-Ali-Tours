import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useItineraryStore } from '../store/itinerary';
import { useUserStore } from '../store/user';

const BookMarki = () => {
    const [bookmarkedItinerary, setbookmarkItinerary] = useState([]);
    const {user} = useUserStore();
    const { getBookmarkedItineraries } = useItineraryStore();

    const fetchBookmarkedActivities = async (userName) => {
        try {
            const bookmarks = await getBookmarkedItineraries(userName);
            setbookmarkItinerary(Array.isArray(bookmarks) ? bookmarks : []);
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

    if (bookmarkedItinerary.length === 0) {
        return <div>No bookmarked itinerary found.</div>; // Show message if no bookmarks
    }
else{
    return (
        
        <div className="p-4">
            {bookmarkedItinerary.map((itinerary) => (
                <div
                    key={bookmarkedItinerary._id}
                    className="relative mb-6 text-black text-left w-fit min-w-[45ch] bg-white mx-auto h-fit rounded shadow-md p-4 border-2 border-gray-300"
                >
                    <h3 className="text-lg font-bold">{itinerary.itineraryId.name}</h3>
                    <p>Date: {new Date(itinerary.itineraryId.date).toLocaleDateString()}</p>
                    <p>Location: {itinerary.itineraryId.location?.coordinates?.join(', ') || "Not available"}</p>
                    <p>Price: ${itinerary.itineraryId.price}</p>
                    <p>Category: {itinerary.itineraryId.category}</p>
                    <p>Tags: {itinerary.itineraryId.tags?.join(', ') || "No tags"}</p>
                    <p>Special Discounts: {itinerary.itineraryId.specialDiscounts || "None"}</p>
                    <p>Booking Open: {itinerary.itineraryId.bookingOpen ? "Yes" : "No"}</p>
                    <p>Creator: {itinerary.itineraryId.creator}</p>
                    <p>Average Rating: {itinerary.itineraryId.rating} (from {itinerary.itineraryId.numReviews} reviews)</p>
                </div>
            ))}
        </div>
    );}
}

export default BookMarki;
