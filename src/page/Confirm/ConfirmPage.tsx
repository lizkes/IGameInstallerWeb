import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import { useAppSelector, useSnackbar } from "@/hook";
import { useUserInfoQuery } from "@/api/user";
import { handleAxiosError } from "@/util/errorHandler";
import { expToLevel } from "@/util/levelHandler";
import BasePage from "@/page/Base";
import WaitingPage from "@/page/Waiting";
import NavigateButtonGroup from "@/component/NavigateButtonGroup";

import DownloadPaper from "./DownloadPaper";
import Prompt from "./Prompt";

const ConfirmPage: FC = () => {
  const navigate = useNavigate();
  const sendSnackbar = useSnackbar();
  const userId = useAppSelector((s) => s.user.userId);
  const resourceInstallInfo = useAppSelector((s) => s.resourceInstallInfo);

  // 获取当前用户信息
  const userInfoQuery = useUserInfoQuery(
    { userId: userId },
    {
      enabled: userId !== 0,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
      },
    }
  );
  // 处理获取数据
  const userInfo = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data;
    }
    return undefined;
  }, [userInfoQuery.data]);
  const isVip = useMemo(() => {
    if (userInfo) {
      const vipRole = userInfo.roles.filter((role) => role.role_id === 3)[0];
      if (vipRole) {
        return true;
      }
    }
    return false;
  }, [userInfo]);
  const lackExp = useMemo(() => {
    if (resourceInstallInfo.allowedExp === 0) {
      return false;
    }
    if (userInfo && (isVip || userInfo.exp >= resourceInstallInfo.allowedExp)) {
      return false;
    }
    return true;
  }, [userInfo, resourceInstallInfo, isVip]);

  if (userId !== 0 && userInfo === undefined) {
    return <WaitingPage message="正在获取用户信息..." />;
  }

  console.log(resourceInstallInfo);

  let content;
  // 如果经验不足
  if (lackExp) {
    let lackMessage = `${expToLevel(
      resourceInstallInfo.allowedExp
    )}级以上用户才能安装该${
      resourceInstallInfo.type === "game" ? "游戏" : "拓展"
    }`;
    if (userInfo) {
      content = (
        <Prompt
          message={`${lackMessage}
          您当前为${expToLevel(userInfo.exp)}级用户
          每日签到可以提升用户等级
          成为IGame会员可以无视等级限制`}
          buttonVariant="buyVip"
        />
      );
    } else {
      content = (
        <Prompt
          message={`${lackMessage}
          您当前尚未登录，登录后方可安装`}
          buttonVariant="login"
        />
      );
    }
  } else {
    content = (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "16px 0",
        }}
      >
        <Box sx={{ flexGrow: 3 }} />
        <DownloadPaper
          variant="normal"
          cost={resourceInstallInfo.normalDownloadCost}
          userIsLogin={userInfo !== undefined}
          userCoin={userInfo?.coin}
          userIsVip={isVip}
        />
        <Box sx={{ flexGrow: 1 }} />
        <DownloadPaper
          variant="fast"
          cost={resourceInstallInfo.fastDownloadCost}
          userIsLogin={userInfo !== undefined}
          userCoin={userInfo?.coin}
          userIsVip={isVip}
        />
        <Box sx={{ flexGrow: 3 }} />
      </Box>
    );
  }

  return (
    <BasePage variant="center">
      <Box sx={{ flexGrow: 4 }} />
      {content}
      <Box sx={{ flexGrow: 5 }} />
      <NavigateButtonGroup
        canBack={true}
        backOnClick={() => navigate("/config")}
      />
    </BasePage>
  );
};

export default ConfirmPage;
