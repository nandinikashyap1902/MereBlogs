import React, { useContext} from 'react'
import { Link,useLocation} from 'react-router-dom'
import { useEffect,useState } from 'react'
import { UserContext } from './UserContext'
// import Lottie from 'lottie-react'
// import bg from './assets/header-bg.json'
//import './Button.scss'
//import './App.css'

export default function Header() {
 // const navigate = useNavigate();

  const { userInfo, setUserInfo } = useContext(UserContext)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery,setSearchQuery]=useState('hello')
  const location = useLocation();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      method: 'GET',
      credentials:'include'
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    })
  }, [setUserInfo])
  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method:'POST'
    })
    .then((response) => {
      if (response.ok) {
        // setUserInfo(null); // Clear user info state
        setUserInfo(null);

        // Redirect to login page and replace history
        // navigate('/login', { replace: true });

        // Optionally, force a full page reload to clear any cached data
        // window.location.reload();
      } else {
        console.error('Failed to log out');
      }
    })
    .catch((error) => {
      console.error('Error during logout:', error);
    });
  }
  // useEffect(() => {
  //   setUserInfo(null);
  // }, []);
  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);
  const username = userInfo?.username
  let name = username ? username.toString().split('@'):''
  name = name[0]
  const handleMouseEnter = () => {
    if (location.pathname === '/posts') return;
    setDropdownVisible(!dropdownVisible);
  };
function handleSearch(){

}
 
  return (
     <header className="flex justify-between items-center p-4 bg-white shadow-md">
       <Link to="/" className="text-2xl font-bold text-blue-600">MERE-BLOGS</Link>
       <form onSubmit={handleSearch} className="flex items-center">
         <input
           type="text"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           placeholder="Search posts..."
           className="border p-2 rounded-md w-full sm:w-auto"
         />
         <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-md">Search</button>
       </form>
       <nav className="hidden md:flex space-x-4">
         {username && (
           <>
             {/* Update your existing links with Tailwind classes, e.g.: */}
             <div className="user-info" onMouseEnter={handleMouseEnter}>
               <p className="font-bold">Welcome Back, {name}</p>
               {location.pathname !== '/posts' && (
                 <div className="dropdown-menu">
                   <Link to="/posts" className="text-blue-600 hover:underline">My posts</Link>
                 </div>
               )}
             </div>
             <Link to="/create" className="text-blue-600 hover:underline">
               <button className="bg-green-500 text-white p-2 rounded-md">Post</button>
             </Link>
             <Link onClick={logout} className="text-blue-600 hover:underline">
               <button className="bg-red-500 text-white p-2 rounded-md">Logout</button>
             </Link>
           </>
         )}
         {!username && (
           <>
             <Link to="/login" className="text-blue-600 hover:underline">
               <button className="bg-blue-500 text-white p-2 rounded-md">Login</button>
             </Link>
             <Link to="/register" className="text-blue-600 hover:underline">
               <button className="bg-green-500 text-white p-2 rounded-md">SignUp</button>
             </Link>
           </>
         )}
       </nav>
       {/* Add mobile menu toggle if desired, e.g., a button to show nav on small screens */}
     </header>
   );
{/* <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
              </svg> */}
            
       
        }
          
{/* <Lottie animationData={bg}></Lottie> */}
        
 