import './App.css';
import Sliceshow from './components/SliceShow';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import Packages from './pages/package';
import Myprofile from './pages/Myprofile';
import Membership from  "./pages/Membership";
import Navbar from './components/Navbar';
import Footer from './components/Footer';


// หน้า Admin
import DashBoard from './pages/admin/DashBoard';
import AdminNews from './pages/admin/AdminNews';
import CreateNews from './pages/admin/CreateNews';
import EditNews from './pages/admin/EditNews';
import AdminSchedule from './pages/admin/AdminSchedule';
import CreateSchedule from './pages/admin/CreateSchedule';
import AdminPackage from './pages/admin/AdminPackage';
import AdminUserList from './pages/admin/AdminUserList';
import AdminCreateUser from './pages/admin/AdminCreateUser';

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

          {/* หน้า User protected ด้วย PrivateRoute */}
          <Route
            path="/Myprofile"
            element={
              <PrivateRoute roleRequired="user">
                <Myprofile />
              </PrivateRoute>
            }
          />
          <Route
            path="/membership"
            element={
              <PrivateRoute roleRequired="user">
                <Membership />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminUserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/create"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminCreateUser />
              </PrivateRoute>
            }
          />
          {/* หน้า Admin News protected ด้วย PrivateRoute */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roleRequired="admin">
                <DashBoard />
              </PrivateRoute>
            }
          />
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

          {/* หน้า Admin Schedule protected ด้วย PrivateRoute */}
          <Route
            path="/admin/schedule"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminSchedule />
              </PrivateRoute>
            }
          />
          {/* CreateSchedule ใช้สำหรับเพิ่มและแก้ไข */}
          <Route
            path="/admin/schedule/create"
            element={
              <PrivateRoute roleRequired="admin">
                <CreateSchedule />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/schedule/edit/:id"
            element={
              <PrivateRoute roleRequired="admin">
                {/* คุณสามารถสร้างหน้า EditSchedule */}
              </PrivateRoute>
            }
          />
        <Route
            path="/admin/packages"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminPackage />
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
