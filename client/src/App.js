
import './App.css';
import Home from './Home';
//import Header from './Header';
import Layout from './Layout';
import { UserContextProvider }  from './UserContext';
import { Route,Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import CreatePost from './CreatePost';
import { PostPage } from './PostPage';
import EditPost from './EditPost';
import Background from './Background';
function App() {
  return (
    <UserContextProvider>
    <Routes>
       <Route path="/" element={<Layout/>}/>
        <Route index element={<Background/>}/>  
        <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
        <Route path='/edit/:id' element={<EditPost />} />
        <Route path='/posts' element={<Home/>}/>
          {/* <Route path="/bg" element={<Background/>} /> */}
 
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
