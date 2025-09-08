// App.js
import './App.css';
import Sliceshow from './components/SliceShow';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import Packages from './pages/package';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={
            <>
              <Sliceshow />
              <News limit={3} />
              <Schedule />
            </>
          } />
          <Route path="/news" element={<News />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/package" element={<Packages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>

        <footer className="footer" id="contact">
          <p>Contact us: fitness.su.ed.center@hotmail.com | © 2025 SUED CENTER</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
