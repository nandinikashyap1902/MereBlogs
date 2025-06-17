
import './App.css';
import { UserContextProvider }  from './UserContext';
import { Route,Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import CreatePost from './CreatePost';
import { PostPage } from './PostPage';
import EditPost from './EditPost';
import Background from './Background';
import Posts from './Posts';
import ForgotPassword from './ForgotPassword';
function App() {
  return (
    <UserContextProvider>
      <Routes>
     
      <Route path="/" element={<Background />} />
        {/* <Route index element={<Background />} /> */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path='/edit/:id' element={<EditPost />} />

        <Route path='/posts' element={<Posts />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

          {/* <Route path="/bg" element={<Background/>} /> */}
 
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
