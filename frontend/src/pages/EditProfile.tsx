import React, {useState, useEffect} from "react";
import { useSellerStore } from "../store/seller";
import { useNavigate } from "react-router-dom"
import {FiLoader} from "react-icons/fi"
import { useTouristStore } from "../store/tourist";
import { useGuideStore } from "../store/tourGuide";
import { useAdvertiserstore } from "../store/advertiser";
import toast from "react-hot-toast"
function EditProfile() {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({userName: ""});
  const { sell, updateSeller } = useSellerStore();
  const { tourist } = useTouristStore();
  const { guide } = useGuideStore();
  const { advertiser } = useAdvertiserstore();
	const type = JSON.parse(localStorage.getItem("user")).type;
	const navigate = useNavigate();
	useEffect(() => {
  if (sell.userName) setUser(sell);
  if (tourist.username) setUser(tourist);
	if (guide.username) setUser(guide);
  if (advertiser.username) setUser(advertiser);
	}, [sell, tourist, guide, advertiser]);
	if (!user || !user?.userName) return null;

	const handleSubmit = async (e) => {
		setLoading(true)
		e.preventDefault();
		console.log(type)
		switch (type) {
			case "seller":
		const {success, message} = await updateSeller(user.userName, user);
				if (success)
				navigate("/")	
					else
				toast.error(message)
				break;

			default:
				break;
		}
		setLoading(false);
	}
  return (
    <div className="bg-[#C1BAA1] w-[35vw] h-fit rounded-lg mx-auto p-4 mt-20">
      {sell.userName && (
        <h1 className="text-center text-2xl">Edit Seller Profile</h1>
      )}
      {tourist.username && (
        <h1 className="text-center text-2xl">Edit Tourist Profile</h1>
      )}
      {guide.username && (
        <h1 className="text-center text-2xl">Edit Guide Profile</h1>
      )}
      {advertiser.username && (
        <h1 className="text-center text-2xl">Edit Advertiser Profile</h1>
      )}
      <form className="space-y-6 my-8" onSubmit={handleSubmit}>
        {Object.keys(user)
          .filter(
            (k) =>
              ![
                "_id",
                "verified",
                "createdAt",
                "updatedAt",
                "__v",
                "profilePicture",
                "profilePicturePath",
								"userName"
              ].includes(k),
          )
          .map((key, index) => (
            <div className="flex justify-between w-full">
              <label key={index} className="text-lg">
                {key}:
              </label>
              {key === "description" ? (
                <textarea
                  key={index}
                  onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                  value={user[key]}
                  className="bg-white/10 rounded-md"
                />
              ) : (
                <input
                  key={index}
                  onChange={(e) => setUser({ ...user, [key]: e.target.value })}
                  type="text"
                  value={user[key]}
                  className="bg-white/10 rounded-md"
                />
              )}
            </div>
          ))}
				<button className="mt-4 bg-[#FEFDED] w-[8.5ch] h-[4ch] rounded-lg">
					{loading ? <FiLoader className="animate-spin mx-auto"/> : "Save"}
				</button>
      </form>
    </div>
  );
}

export default EditProfile;
