import { createContext,useContext, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({children}) {

    const [token,setToken] = useState(() => localStorage.getItem('token')||null);

 

    const login = async (email,password) => {
        try{
            const response = await fetch("https://34.47.233.91/api/login",{ // added /api
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email:email,password:password})
            })
            const data = await response.json();
          
            if(data.token){
                setToken(data.token);
                localStorage.setItem("token",data.token);
                return true;
            }else{
                return false;
            }
            

        }catch(err){
            
            console.error(err);
            return false;
        }
    }

    const logout = () => {
       
        localStorage.removeItem('token');
        setToken(null);

    }


  return (
    
        <AuthContext.Provider value={{token,login,logout}} >
            {children}
        </AuthContext.Provider> 
    
  )
}

export const useAuth = () => useContext(AuthContext);
