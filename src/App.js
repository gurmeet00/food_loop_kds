import logo from './logo.svg';
import './App.css';
import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Components/Header";
import { store } from "./Components/Redux_Store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

const persistor = persistStore(store);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
