import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"

import { Provider } from 'react-redux'
import { store } from './store/store.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import axios from "axios";

// Setup axios
axios.defaults.baseURL = "http://localhost:8080/api/v1";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

