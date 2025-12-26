import { Navigate } from "react-router-dom";

export const isAuthenticated = ()=>{
    return Boolean(localStorage.getItem("accessToken"));
}

export const ProtectedRoutes = ([children])=>{
    if(!isAuthenticated()){
        return <Navigate to="/feature"/>;
    }
    return children;
}