import './App.css';
import Sliceshow from './components/SliceShow';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import Packages from './pages/package';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// หน้า Admin
import AdminNews from './pages/admin/AdminNews';
import CreateNews from './pages/admin/CreateNews';
import EditNews from './pages/admin/EditNews';

// PrivateRoute
import PrivateRoute from './components/PrivateRoute';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          {/* หน้า Public */}
          <Route
            path="/"
            element={
              <>
                <Sliceshow />
                <News limit={3} />
                <Schedule />
              </>
            }
          />
          <Route path="/news" element={<News />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/package" element={<Packages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />

          {/* หน้า Admin News protected ด้วย PrivateRoute */}
          <Route
            path="/admin/news"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/news/create"
            element={
              <PrivateRoute roleRequired="admin">
                <CreateNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/news/edit/:id"
            element={
              <PrivateRoute roleRequired="admin">
                <EditNews />
              </PrivateRoute>
            }
          />
        </Routes>
       <Footer />
      </div>
    </Router>
  );
}

export default App;
