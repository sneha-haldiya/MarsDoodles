import Home from "./Home";
import Login from "./components/Authentication/Login"
import Signup from "./components/Authentication/Signup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
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
