import {useContext, useEffect ,useState} from 'react'

import { AuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom';
import NavSidebar from '../components/NavSidebar';


export default function ProtectedRoutes({children}) {

   
    const {token,logout} = useContext(AuthContext);
    const[isAuthenticated,setIsAuthenticated] = useState(null);

    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const response =  await fetch("http://34.47.233.91:5000/tokenCheck",{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json();
                
                if(data.message === "Valid token"){
                    
                   setIsAuthenticated(true);
                }else{
                    setIsAuthenticated(false);
                    logout();
                }

            }catch(err){
                console.error(err);
            }
        }
        fetchData();
    }, [token])

  
    if (isAuthenticated === null) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      }


    


      return isAuthenticated? <NavSidebar>{children}</NavSidebar> : <Navigate to="/login" />;

 
}
