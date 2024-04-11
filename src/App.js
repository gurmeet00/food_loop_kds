import logo from './logo.svg';
import './App.css';
import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./Components/Header";
import { store } from "./Components/Redux_Store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const persistor = persistStore(store);

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
