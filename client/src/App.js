
import './App.css';
import Home from './Home';
//import Header from './Header';
import Layout from './Layout';

import { Route,Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>}/>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        </Route>
    </Routes>

    
  );
}

export default App;
