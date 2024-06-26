import React, { useState } from "react"
//import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


const Signup = () => {
    const relocate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const res = await response.json();
            if (res === "Signup Success") {
                relocate("/")
            }
            else {
                alert(res);
            }
        }
        catch (e) {
            alert(`Error: ${e}`);
        }
    }


    return (
        <div className="flex flex-col bg-black bg-opacity-20 p-4 rounded-md max-w-md mx-auto align-center">

            <h1 className="self-center text-2xl text-white">Signup</h1>

            <form action="POST" className="flex flex-col gap-2 m-2 ">
                <label className='text-left text-base text-white font-semibold'>Username</label>
                <input type="text" className='p-1 outline-0 border border-gray-300 rounded-md' onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" />
                <label className='text-left text-base text-white font-semibold'>Password</label>
                <input type="password" className='p-1 outline-0 border border-gray-300 rounded-md' onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <input type="submit" className="p-2 pt-1 pb-1 outline-0 rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white" onClick={submit} />

            </form>

            <button className="bg-black rounded-md w-fit bg-opacity-10 self-center hover:ring hover:ring-white p-2 flex flex-col">
                <Link to="/" className="text-sm text-white ">Login</Link>
            </button>
        </div>
    )
}

export default Signup