import { set } from 'mongoose';
import React from 'react'
import { useUserStore } from '../store/user';
import { toCamelCase } from '../lib/util';
function RegisterPage() {
    const [newUser, setNewUser] = React.useState({
        userName: "",
        email: "",
        password: "",
    });

    const [tourist, setTourist] = React.useState({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
        nationality: "",
        dateOfBirth: "",
        occupation: "",
    });

    const {createUser, user} = useUserStore();

    const handleAddUser =  async function(type) {
        const passedUser = newUser
        passedUser.type = type
       const {success, message} =  await createUser(passedUser);
       console.log(success, message);
    }

    const handleAddTourist = async function() {
        const passedTourist = tourist
        passedTourist.type = "tourist"
        const {success, message} = await createUser(passedTourist);
        console.log(success, message);
    }


    const types = ["tour guide", "advertiser", "seller"]
    let typeSelector = types.map((type) => (
        <button key={type} className='bg-black text-white m-6 p-2 rounded' onClick={() => (handleAddUser(type))}>{type}</button>
    ));

    const touristData = ["UserName", "Email", "Password", "Mobile Number", "Nationality","Date of Birth","Occupation",]
    let touristDataInput = touristData.map((data) => {
        const camelCaseName = toCamelCase(data);
        return (
            <input
                name={camelCaseName}
                key={camelCaseName}
                value={tourist[camelCaseName]}
                onChange={(e) => setTourist({ ...tourist, [e.target.name]: e.target.value })}
                className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300'
                type='text'
                placeholder={data}
            />
        );
    });

  return (
    <div className='flex'>
    <div className='bg-white mt-32 h-fit mx-auto pt-2 rounded-xl'>
        <div className='flex flex-col items-center'>
            <input name='userName' value={newUser.userName} onChange={(e) => setNewUser({ ...newUser, userName: e.target.value})} placeholder='Username' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' />
            <input name='email' value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value})} placeholder='Email' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='text' />
            <input name='password' value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value})} placeholder='Password' className='border border-[rgb(205,205,205)] m-6 p-2 shadow-md rounded bg-gray-300' type='password'/>
            <p className='text-black'>registering as</p>
            <div className='text-sm flex'>
            {typeSelector}
            </div>
        </div>
    </div>
    <div className='bg-white mt-32 h-fit  mx-auto pt-2 rounded-xl'>
        <div className='flex flex-col items-center'>
            {touristDataInput}
            <div className='text-sm flex'>
            <button onClick={() => (handleAddTourist())} className='bg-black text-white m-6 p-2 rounded'>tourist</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default RegisterPage