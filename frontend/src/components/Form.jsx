import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/Form.css'
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

function Form({route, method}) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try{
        const res = await api.post(route,{username, password})
        if(method === 'login'){
            localStorage.setItem(ACCESS_TOKEN,res.data.access)
            localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
            navigate('/')
        }
        else{
            navigate('/login')
        }
    }
    catch(error){
        alert(error)
        console.log(error)
        setLoading(false)
    }
    finally{
        setLoading(false)
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h1>{name}</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Username"
        className="form-input"
      />
      <input
        type="password"
        className="form-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
      />
      {loading && <LoadingIndicator/>}
      <button type="submit" className="form-button">
        {name}
      </button>
    </form>
  );
}
export default Form;
