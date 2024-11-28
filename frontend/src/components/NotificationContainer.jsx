import React from 'react'
import { Link } from 'react-router-dom';
function NotificationContainer({notification}) {
  return (
    <div className="mx-auto bg-[#161821f0] w-fit p-6 rounded-xl backdrop-blur-lg">
			<h1 className="text-xl">{notification.title}</h1>
			<p className="mt-2">{notification.message}</p>
			<Link to={notification.link}>
				<button className="bg-[#f5f5f5] text-black mt-2 p-2 rounded-lg">View</button>
			</Link>


		</div>
  )
}

export default NotificationContainer
