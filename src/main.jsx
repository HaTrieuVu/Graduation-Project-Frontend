import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"

import { Provider } from 'react-redux'
import { store } from './store/store.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

