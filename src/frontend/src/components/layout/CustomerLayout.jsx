import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCustomerCart } from "../../services/publicApi.js";
import {
  setCartData,
  setCartError,
  setCartLoading,
} from "../../store/cartSlice.js";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function CustomerLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    dispatch(setCartLoading());
    getCustomerCart()
      .then((response) => {
        if (active) dispatch(setCartData(response.data.data));
      })
      .catch((error) => {
        if (active) {
          dispatch(
            setCartError(
              error.response?.data?.message ||
                "Không thể tải giỏ hàng. Vui lòng thử lại.",
            ),
          );
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
