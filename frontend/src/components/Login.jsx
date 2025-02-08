import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      return;
    }
    try{

        const respone = await login(email, password);
        if (respone) {
            navigate("/");
        }
    }catch(err){
        console.error(err);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[50%] max-w-[25rem] h-[40%] bg-white rounded-sm flex flex-col justify-center items-center border gap-4">
        <h1 className="text-4xl font-bold">Login</h1>
       

        <label className="input validator">

        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
         
          />
          </label>
       <label className="input validator">
       <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
         
        />
        </label>
        <button
          onClick={() => handleLogin(email, password)}
          className="btn btn-primary w-[50%]"
        >
          Login
        </button>
        {/* <a href="/register" className="link">
          Register
        </a> */}
      </div>
    </div>
  );
}
