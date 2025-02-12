import React from 'react'
import { useState } from 'react';

export default function Register() {
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');

    const register = async () => {
        const response = await fetch('http://34.47.233.91:5000/register',{
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        })
        const data = await response.json();
        console.log(data);
    }


  return (
    <div className='bg-blue-400 w-screen h-screen flex justify-center items-center'>
        <div className='size-60 bg-white rounded-lg flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-bold'>Register</h1>
            <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email' className='w-[80%] p-2 my-2 border border-gray-300 rounded-lg'/>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='w-[80%] p-2 my-2 border border-gray-300 rounded-lg'/>
            <button onClick={register} className='w-[80%] p-2 my-2 bg-red-400 text-white rounded-lg'>Register</button>
            <a href="/login" className='text-blue-400'>Login</a>
        </div>
      
    </div>
  )
}
