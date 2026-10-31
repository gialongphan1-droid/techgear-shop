import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  getCurrentCustomer,
  getCustomerCart,
} from "../../services/publicApi.js";
import {
  clearCart,
  setCartData,
  setCartError,
  setCartLoading,
} from "../../store/cartSlice.js";
import {
  setCustomerAuthError,
  setCustomerSession,
  setCustomerUnauthenticated,
} from "../../store/userAuthSlice.js";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function CustomerLayout() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.userAuth.status);

  useEffect(() => {
    if (authStatus !== "checking") return undefined;
    let active = true;
    getCurrentCustomer()
      .then((response) => {
        if (!active) return;
        const session = response.data.data;
        dispatch(
          setCustomerSession({
            user: session.user || session,
            csrfToken: session.csrfToken,
          }),
        );
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          dispatch(setCustomerUnauthenticated());
          return;
        }
        dispatch(
          setCustomerAuthError(
            error.response?.data?.message ||
              "Không thể kiểm tra phiên đăng nhập. Vui lòng thử lại.",
          ),
        );
      });

    return () => {
      active = false;
    };
  }, [authStatus, dispatch]);

  useEffect(() => {
    if (authStatus === "checking" || authStatus === "error") return undefined;
    if (authStatus !== "authenticated") {
      dispatch(clearCart());
      return undefined;
    }

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
  }, [authStatus, dispatch]);

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
