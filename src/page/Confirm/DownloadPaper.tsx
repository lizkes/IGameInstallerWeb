import { FC, useCallback } from "react";
import { Paper, Typography } from "@mui/material";
import { useModal } from "mui-modal-provider";

import ErrorDialog from "./ErrorDialog";
import OkDialog from "./OkDialog";

type DownloadPaperProps = {
  variant: "normal" | "fast";
  cost: number;
  userIsLogin: boolean;
  userCoin?: number;
  userIsVip: boolean;
};
const DownloadPaper: FC<DownloadPaperProps> = ({
  variant,
  cost,
  userIsLogin,
  userCoin = 0,
  userIsVip,
}) => {
  const { showModal } = useModal();

  const paperClick = useCallback(() => {
    if (cost === 0) {
      const modal = showModal(OkDialog, {
        title: variant === "normal" ? "普通下载" : "快速下载",
        content: `下载该资源完全免费
                  您甚至无需登录账号`,
        variant: variant,
        closeFn: () => {
          modal.hide();
        },
      });
    } else if (userIsLogin) {
      if (cost > userCoin && !userIsVip) {
        const modal = showModal(ErrorDialog, {
          title: "无限币不足",
          content: `安装该资源需要花费 ${cost} 个无限币
                    您当前拥有 ${userCoin} 个无限币
                    点击右上角进行每日签到可以获取无限币
                    成为IGame会员可以免费安装所有资源`,
          buttonVariant: "buyVip",
          closeFn: () => {
            modal.hide();
          },
        });
      } else if (cost > 0 && userIsVip) {
        const modal = showModal(OkDialog, {
          title: variant === "normal" ? "普通下载" : "快速下载",
          content: `下载该资源需要花费 ${cost} 个无限币
                    您当前是IGame会员，本次下载免费`,
          variant: variant,
          closeFn: () => {
            modal.hide();
          },
        });
      } else {
        const modal = showModal(OkDialog, {
          title: variant === "normal" ? "普通下载" : "快速下载",
          content: `下载该资源需要花费 ${cost} 个无限币
                    您当前拥有 ${userCoin} 个无限币`,
          variant: variant,
          closeFn: () => {
            modal.hide();
          },
        });
      }
    } else {
      const modal = showModal(ErrorDialog, {
        title: "尚未登录",
        content: `安装该资源需要花费 ${cost} 个无限币
                  您当前尚未登陆，请登录后下载`,
        buttonVariant: "login",
        closeFn: () => {
          modal.hide();
        },
      });
    }
  }, [showModal, userIsLogin, userCoin, userIsVip, cost, variant]);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        padding: "16px",
        cursor: "pointer",
        border: (t) =>
          `2px solid ${
            variant === "normal"
              ? t.palette.success.light
              : t.palette.secondary.light
          }`,
        "&:hover": {
          filter: "brightness(90%)",
        },
        transition: "all 150ms",
      }}
      onClick={paperClick}
      elevation={6}
    >
      <Typography
        sx={{
          fontSize: "1.8rem",
          color: (t) =>
            variant === "normal"
              ? t.palette.success.light
              : t.palette.secondary.light,
        }}
      >
        {variant === "normal" ? "普通下载" : "快速下载"}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          fontFamily: "'Roboto','Microsoft YaHei',sans-serif",
          filter: "opacity(70%)",
        }}
      >
        {cost === 0 ? "免费" : `花费 ${cost} 个无限币`}
      </Typography>
    </Paper>
  );
};

export default DownloadPaper;
