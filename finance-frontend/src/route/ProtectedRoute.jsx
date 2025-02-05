import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { curUser } = useAuth();
    const location = useLocation();

    return (
        curUser
        ? <Outlet /> 
        : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default ProtectedRoute;
