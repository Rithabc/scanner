
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');

    const navigate = useNavigate();

    const login = async () => {
        const response = await fetch('http://localhost:5000/login',{
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
        if(data.message === 'Done'){
            
           navigate('/');
        }
    }
  return (
    <div className='bg-red-400 w-screen h-screen flex justify-center items-center'>
        <div className='size-60 bg-white rounded-lg flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email' className='w-[80%] p-2 my-2 border border-gray-300 rounded-lg'/>
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='w-[80%] p-2 my-2 border border-gray-300 rounded-lg'/>
            <button onClick={login} className='w-[80%] p-2 my-2 bg-blue-400 text-white rounded-lg'>Login</button>
            <a href="/register" className='text-red-400'>Register</a>
        </div>
      
    </div>
  )
}
