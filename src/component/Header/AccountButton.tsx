import { useState, useRef, useMemo } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Typography,
  Box,
  Button,
  Link,
  LinearProgress,
  Chip,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AccountCircle,
  Download,
  ExitToApp,
  Favorite,
  MonetizationOn,
  Sync,
  Visibility,
} from "@mui/icons-material";
import { amber, green, indigo, purple, red } from "@mui/material/colors";

import { useAppDispatch, useAppSelector, useSnackbar } from "@/hook";
import { useUserDailyBonusMutation, useUserInfoQuery } from "@/api/user";
import { setUserId } from "@/slice/userSlice";
import { handleAxiosError } from "@/util/errorHandler";
import { expToLevel, nextLevelExp } from "@/util/levelHandler";
import { dateFormat, toDate, isToday, dateToDay } from "@/util/timeHandler";
import { setAccessToken, setRefreshToken } from "@/util/localStorageHandler";
import CustomPopper from "@/component/CustomPopper";
import FlashingBadge from "@/component/FlashingBadge";
import NormalSkeleton from "@/component/NormalSkeleton";

const AccountButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const sendSnackbar = useSnackbar();
  const userId = useAppSelector((s) => s.user.userId);
  const [popperIsOpen, setPopperIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  // 获取当前用户信息
  const userInfoQuery = useUserInfoQuery(
    {
      userId: userId,
    },
    {
      enabled: userId !== 0 && popperIsOpen,
      onError: (error) => {
        const errorInfo = handleAxiosError(error);
        sendSnackbar("获取用户信息失败", errorInfo.content, "error");
        if (errorInfo.code !== 500) {
          // 如果系统没有维护中
          setAccessToken(null);
          setRefreshToken(null);
          dispatch(setUserId(0));
        }
      },
    }
  );
  const userDailyBonusMutation = useUserDailyBonusMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("用户签到失败", errorInfo.content, "error");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userInfo", data.data.user_id]);
      sendSnackbar(
        "用户签到成功",
        `您已连续签到${data.data.count}天
        奖励${data.data.added_exp}点经验
        奖励${data.data.added_coin}个无限币`,
        "success"
      );
    },
  });
  // 处理获取数据
  const userInfo = useMemo(() => {
    if (userInfoQuery.data) {
      return userInfoQuery.data.data;
    }
    return null;
  }, [userInfoQuery.data]);
  const isDailyBonusToday: boolean = useMemo(() => {
    if (userInfo && userInfo.last_daily_bonus_time) {
      return isToday(toDate(userInfo.last_daily_bonus_time));
    }
    return false;
  }, [userInfo]);
  const [isVip, remainVipDay]: [boolean, number] = useMemo(() => {
    if (userInfo) {
      const vipRole = userInfo.roles.filter((role) => role.role_id === 3)[0];
      if (vipRole) {
        return [true, dateToDay(toDate(vipRole.expire_at!))];
      }
    }
    return [false, 0];
  }, [userInfo]);
  // 返回页面
  return (
    <>
      <FlashingBadge color={userId ? green[600] : red[600]}>
        <IconButton
          ref={anchorRef}
          onClick={() => {
            setPopperIsOpen((open) => !open);
          }}
          sx={{
            padding: "12px",
          }}
        >
          <AccountCircle
            sx={{
              color: "white",
              height: {
                default: "1.1em",
                large: "1.2em",
              },
              width: {
                default: "1.1em",
                large: "1.2em",
              },
            }}
          />
        </IconButton>
      </FlashingBadge>
      <CustomPopper
        anchorEl={anchorRef.current}
        isOpen={popperIsOpen}
        closeFn={() => setPopperIsOpen(false)}
        placement="bottom-end"
        transformOrigin="right top"
      >
        {userInfoQuery.isLoading ? (
          <NormalSkeleton
            sx={{
              width: "228px",
              height: "356px",
            }}
          />
        ) : userInfo ? (
          <Box
            sx={{
              width: "228px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                {userInfo.nick_name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <Typography>{userInfo.email}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "8px",
              }}
            >
              <Chip
                size="small"
                label={isVip ? "IGame会员" : "普通用户"}
                sx={{
                  cursor: "pointer",
                  transition: "all 150ms",
                  color: "white",
                  backgroundColor: isVip ? purple[500] : green[600],
                  "&:hover": {
                    filter: "brightness(75%)",
                  },
                }}
              />
              {isVip ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  {remainVipDay}天后到期
                </Typography>
              ) : null}
            </Box>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              sx={{
                fontSize: "1.1rem",
              }}
              onClick={() => {
                setPopperIsOpen(false);
                navigate("/buy/vip");
              }}
            >
              {isVip ? "会员续期" : "成为会员"}
            </Button>
            <Divider
              sx={{
                margin: "16px 0",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Typography>等级{expToLevel(userInfo.exp)}</Typography>
              <Typography sx={{ fontSize: "0.75rem" }}>
                {userInfo.exp}/{nextLevelExp(userInfo.exp)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(userInfo.exp / nextLevelExp(userInfo.exp)) * 100}
              sx={{
                backgroundColor: indigo[100],
                marginBottom: "8px",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: indigo.A700,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "8px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <MonetizationOn
                  sx={{
                    color: amber[500],
                    marginRight: "2px",
                  }}
                />
                <Typography>{userInfo.coin}</Typography>
              </Box>
              {isDailyBonusToday ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  连续签到 {userInfo.daily_bonus_count} 天
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                  }}
                >
                  上次签到：
                  {userInfo.last_daily_bonus_time
                    ? dateFormat(toDate(userInfo.last_daily_bonus_time), false)
                    : "从未签到"}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <LoadingButton
                variant="contained"
                fullWidth
                color="success"
                disabled={isDailyBonusToday}
                sx={{
                  fontSize: "1.1rem",
                }}
                loading={
                  userDailyBonusMutation.isLoading || userInfoQuery.isLoading
                }
                onClick={() => {
                  userDailyBonusMutation.mutate();
                }}
              >
                {isDailyBonusToday ? "已签到" : "签到"}
              </LoadingButton>
            </Box>
            <Divider
              sx={{
                margin: "16px 0",
              }}
            />
            <Button
              variant="contained"
              startIcon={<ExitToApp />}
              fullWidth
              color="error"
              sx={{
                fontSize: "1.1rem",
              }}
              onClick={() => {
                dispatch(setUserId(0));
                setPopperIsOpen(false);
                setAccessToken(null);
                setRefreshToken(null);
              }}
            >
              注销
            </Button>
          </Box>
        ) : (
          <>
            <Typography sx={{ fontSize: "1.25rem", marginBottom: "16px" }}>
              登录后您可以：
            </Typography>
            <Box sx={{ display: "flex", marginBottom: "8px" }}>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                }}
              >
                <Visibility color="primary" sx={{ marginRight: "4px" }} />
                <Typography>浏览限制资源</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Download color="primary" sx={{ marginRight: "4px" }} />
                <Typography>下载付费资源</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", marginBottom: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  marginRight: "16px",
                }}
              >
                <Sync color="primary" sx={{ marginRight: "4px" }} />
                <Typography>同步活动记录</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Favorite color="primary" sx={{ marginRight: "4px" }} />
                <Typography>获取订阅更新</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ marginBottom: "8px", fontSize: "1.1rem" }}
              onClick={() => {
                setPopperIsOpen(false);
                navigate("/login");
              }}
            >
              立即登录
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography>
                首次使用？
                <Link
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPopperIsOpen(false);
                    navigate("/register");
                  }}
                >
                  点我注册
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </CustomPopper>
    </>
  );
};

export default AccountButton;
