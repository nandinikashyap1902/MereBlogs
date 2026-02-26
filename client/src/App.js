import './styles/App.css';
import { UserContextProvider } from './context/UserContext';
import { Route, Routes } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePost from './pages/CreatePost';
import { PostPage } from './pages/PostPage';
import EditPost from './pages/EditPost';
import Posts from './pages/Posts';
import BlogGenerator from './pages/BlogGenerator';
import Feed from './pages/Feed';
import SearchResults from './pages/SearchResults';

// Components
import Background from './components/Background';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Background />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/post/:id" element={<PostPage />} />

        {/* Protected — require login */}
        <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/generate" element={<ProtectedRoute><BlogGenerator /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
