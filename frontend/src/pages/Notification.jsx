import React, {useEffect, useState} from 'react'
import Axios from 'axios';
import NotificationContainer from '../components/NotificationContainer';
import { useTouristStore } from '../store/tourist.js';
import { useGuideStore} from "../store/tourGuide.js"
import { useAdvertiserstore} from '../store/advertiser.js'
import {FiLoader} from 'react-icons/fi';
function Notification() {
	const { tourist, getTourist } = useTouristStore();
	const { guide, getGuide } = useGuideStore();
	const { advertiser, getAdvertiser} = useAdvertiserstore();
	const [ tempUser, setTempUser ] = useState();

	useEffect(() => {
	if (!!tourist?.userName)
		setTempUser(tourist)
	if(!!guide?.userName)
		setTempUser(guide)
	if (!!advertiser?.userName)
		setTempUser(advertiser)
},[tourist, guide, advertiser])

	useEffect(() => {
		const markAsRead = async () => {
			try {
				if(!!tempUser.userName && tempUser.notifications.length > 0){
				await Axios.put(`http://localhost:5000/api/notifications`,{userName: tempUser.userName});
				getTourist({userName : tempUser.userName},{});
				getGuide({userName : tempUser.userName},{});
				getAdvertiser({userName : tempUser.userName});
				}
			} catch (err) {
				console.log(err);
			}
		}
	markAsRead();
	}, [tempUser])	
	if (!tempUser?.notifications) {
	return <FiLoader size={40} className="mx-auto  mt-[45vh] animate-spin"/>	
	}
  return (
    <div className="bg-transparent mt-[2vh]">

{tempUser.notifications.map((notification, index) => (
				<div key={index}>
			<NotificationContainer  notification={notification}/>	
			</div>
		))}

		</div>
  )
}

export default Notification
