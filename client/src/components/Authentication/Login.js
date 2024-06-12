import React, {useState } from "react"
import { useNavigate, Link } from "react-router-dom"


function Login() {

    const history=useNavigate();

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e){
        e.preventDefault();

        try{
            const response = await fetch("http://localhost:8000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const res = await response.json();
            if (res === "exist") {
                history("/home", { state: { id: username } });
            } 
            else if(res ==="wrongPassword"){
                alert("Incorrect password!");
            }
            else if (res === "notexist") {
                alert("User have not signed up");
            }
        }
        catch(e){
            alert("Wrong details");
            console.log(e);
        }

    }


    return (
        <div className="login">

            <h1>Login</h1>

            <form action="POST">
                <input type="text" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/signup">Signup Page</Link>

        </div>
    )
}

export default Login