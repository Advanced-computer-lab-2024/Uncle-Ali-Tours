import React, {useEffect} from 'react'
import Axios from 'axios';
import NotificationContainer from '../components/NotificationContainer';
import { useTouristStore } from '../store/tourist.js';
import {FiLoader} from 'react-icons/fi';
function Notification() {
	const { tourist, getTourist } = useTouristStore();
	useEffect(() => {
		const markAsRead = async () => {
			try {

					console.log(tourist.notifications);
				if(!!tourist.userName && tourist.notifications.length > 0){
				await Axios.put(`http://localhost:5000/api/tourist/notifications`,{userName: tourist.userName});
				getTourist({userName : tourist.userName},{});
				}
			} catch (err) {
				console.log(err);
			}
		}
	markAsRead();
	}, [tourist])	
	if (!tourist.notifications) {
	return <FiLoader size={40} className="mx-auto  mt-[45vh] animate-spin"/>	
	}
  return (
    <div className="bg-transparent mt-[2vh]">

{tourist.notifications.map((notification, index) => (
				<div key={index}>
			<NotificationContainer  notification={notification}/>	
			</div>
		))}

		</div>
  )
}

export default Notification
