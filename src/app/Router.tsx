import { useEffect, FC } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/hook";
import { getUserIdFromToken } from "@/util/tokenHandler";
import { setUserId } from "@/slice/userSlice";
import {
  MessagePage,
  PreparePage,
  ConfigPage,
  ConfirmPage,
  InstallPage,
  DonePage,
  LoginPage,
  RegisterPage,
  ForgetPage,
  UpdatePage,
} from "@/page";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import BuyPage from "@/page/Buy";

const homeUrl = "/prepare";

const Router: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/index.html") {
      navigate(homeUrl, { replace: true });
    }
  }, [location.pathname, navigate]);

  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.user.userId);
  useEffect(() => {
    if (userId === 0) {
      const userIdFromToken = getUserIdFromToken() ?? 0;
      if (userIdFromToken !== userId) {
        dispatch(setUserId(userIdFromToken));
      }
    }
  }, [userId, dispatch]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Routes>
        <Route path="/prepare" element={<PreparePage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/install" element={<InstallPage />} />
        <Route path="/done" element={<DonePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/buy/vip" element={<BuyPage variant="vip" />} />
        <Route
          path="*"
          element={<MessagePage content="该页面不存在" variant="error" />}
        />
      </Routes>
      <Footer />
    </Box>
  );
};

export { homeUrl };
export default Router;
