import Home from "./components/Home";
import Login from "./components/Authentication/Login"
import Signup from "./components/Authentication/Signup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center" style={{
      backgroundImage: "url('https://img.freepik.com/premium-photo/sapphire-serenity-blur-abstract-background-captivating-sapphire-hues_954894-11575.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Router>
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path="/signup" element = {<Signup/>}/>
          <Route path="/home" element = {<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
