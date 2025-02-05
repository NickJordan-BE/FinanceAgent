import useAuth from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../context/firebase';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'


const NavBar = () => {
    const { curUser } = useAuth();
    const [isOpen, setOpen] = useState(false);
    const navRef = useRef(null);
    const burgerRef = useRef(null);

    const handleLogout = async () => {
        await signOut(auth);
    }

    const toggleMenu = () => {
        setOpen(!isOpen);
    }

    useEffect(() => {
        const handleOutClick = (e) => {
            if (
                navRef.current
                && !navRef.current.contains(e.target)
                && burgerRef.current
                && burgerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        
        const handleResize = () => {
            setOpen(false);
        }

        document.addEventListener("mousedown", handleOutClick);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handleOutClick);
            window.removeEventListener("resize", handleResize);
        };

    }, []);




    return (
        <div className='navBar'>
            <ul className={!isOpen ? "ul" : "active"}>
                <li className="li">
                    <Link to="/"><button class="button"><p className="p">Home</p></button></Link>
                </li>
                <li className="li">
                    <Link to="/spend-tracker"><button className="button"><p className="p">Spending Tracker</p></button></Link>
                </li>
                <li class="li">
                    <Link to="/budgets"><button className="button"><p className="p">Budgets</p></button></Link>
                </li>
                { curUser 
                ? <li className="li">
                    <button className="button" onClick={handleLogout}><p className="p">Logout</p></button>
                 </li>
                : <>
                <li className="li">
                   <Link to="/login"><button className="button" ><p className="p">Login</p></button></Link>
                </li>
                <li className="li">
                 <Link to="/register"><button className="button" ><p className="p">Register Account</p></button></Link>
                </li>
                </>
                }

            
            </ul>
            <div className='burger' ref={burgerRef} onClick={toggleMenu}>
                {!isOpen 
                ? <FontAwesomeIcon icon={faBars} className='bar'/>
                : <FontAwesomeIcon icon={faXmark} className='bar'/>}
            </div>
        </div>
    )
}

export default NavBar
