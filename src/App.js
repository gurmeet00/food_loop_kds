import "./App.css";
import { Provider } from "react-redux";
import Home from "./Components/Home.tsx";
import Header from "./Components/Header.tsx";
import StoreClose from "./Components/StoreClose.tsx";
import { store } from "./Components/Redux_Store/Store";
import PageNotFound from "./Components/PageNotFound.tsx";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
        {
          path: "/storeclose",
          element: <StoreClose />,
        },
        {
          path: "*",
          element: <PageNotFound />,
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
