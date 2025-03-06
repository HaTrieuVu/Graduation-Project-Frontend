
import { Outlet } from 'react-router-dom'
import './App.scss'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <main>
      <Header />
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
