import { useEffect } from 'react';

import { Outlet } from 'react-router-dom'
import './App.scss'

import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import axios from "./config/axios";

import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar/Sidebar';
import { useDispatch } from 'react-redux';
import { clearUser, setInfoUser } from './store/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      let response = await axios.get("/api/v1/account");
      if (response?.errorCode === 0) {
        dispatch(setInfoUser(response?.data?.user));
      } else {
        dispatch(clearUser());
      }
    } catch (error) {
      console.log(error)
      dispatch(clearUser());
    }
  };

  return (
    <main>
      <Header />
      <Sidebar />
      <div className=''>
        <Outlet />
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000} // Thử giảm thời gian tự đóng
        hideProgressBar={true} // Ẩn thanh tiến trình
        closeOnClick={true}
        pauseOnFocusLoss={false} // Tắt tính năng tạm dừng khi mất focus
        pauseOnHover={true}
        draggable
        theme="light"
      />
    </main>

  )
}

export default App
