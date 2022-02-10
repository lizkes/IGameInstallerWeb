import { FC, useState, useMemo, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Refresh, Close, ChevronRight } from "@mui/icons-material";
import { VirtualElement, Placement } from "@popperjs/core";

import { useSnackbar } from "@/hook";
import {
  useVerifyImageNewMutation,
  useVerifyImageVerifyMutation,
} from "@/api/verifyImage";
import { handleAxiosError } from "@/util/errorHandler";
import CustomPopper from "@/component/CustomPopper";

type Props = {
  anchorEl: VirtualElement | (() => VirtualElement) | null | undefined;
  isOpen: boolean;
  needFetch: boolean;
  endpoint: string;
  closeFn: () => void;
  fetchCompleteFn: () => void;
  verifyCompleteFn: () => void;
  placement?: Placement;
  transformOrigin?:
    | "bottom"
    | "center"
    | "left"
    | "right"
    | "top"
    | (string & {});
};

const VerifyImagePopper: FC<Props> = ({
  anchorEl,
  isOpen,
  needFetch,
  endpoint,
  closeFn,
  fetchCompleteFn,
  verifyCompleteFn,
  placement = "top",
  transformOrigin = "bottom",
}) => {
  const sendSnackbar = useSnackbar();
  const [puzzleLeft, setPuzzleLeft] = useState<number>(0);
  const [puzzleClientX, setPuzzleClientX] = useState<number>(0);
  const [puzzleIsMoving, setPuzzleIsMoving] = useState<boolean>(false);
  const [verifyIsError, setVerifyIsError] = useState<boolean>(false);

  // 获取验证图片
  const verifyImageNewMutation = useVerifyImageNewMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("获取验图片失败", errorInfo.content, "error");
    },
  });
  // 验证值
  const verifyImageVerifyMutation = useVerifyImageVerifyMutation({
    onSuccess: () => {
      verifyCompleteFn();
      setPuzzleLeft(0);
    },
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      if (errorInfo.code === 1 && errorInfo.cause === "apiLimiterValue") {
        setVerifyIsError(true);
      } else {
        sendSnackbar("滑动验证失败", errorInfo.content, "error");
      }
      setPuzzleLeft(0);
    },
  });
  // 处理获取数据
  const verifyImageNewData = useMemo(() => {
    if (verifyImageNewMutation.data) {
      return verifyImageNewMutation.data.data;
    }
    return null;
  }, [verifyImageNewMutation.data]);

  useEffect(() => {
    if (isOpen && needFetch) {
      fetchCompleteFn();
      verifyImageNewMutation.mutate({ endpoint: endpoint });
    }
  }, [isOpen, needFetch, fetchCompleteFn, verifyImageNewMutation, endpoint]);

  return (
    <CustomPopper
      anchorEl={anchorEl}
      isOpen={isOpen}
      closeFn={closeFn}
      placement={placement}
      transformOrigin={transformOrigin}
      paperSx={{
        padding: "0",
      }}
      clickAwayEnable={false}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "16px 16px 4px 16px",
          userSelect: "none",
        }}
        onMouseMove={(e) => {
          if (puzzleIsMoving) {
            let left = e.clientX - puzzleClientX;
            if (left < 0) {
              left = 0;
            } else if (left > 256) {
              left = 256;
            }
            setPuzzleLeft(left);
          }
        }}
        onMouseUp={() => {
          if (puzzleIsMoving) {
            setPuzzleIsMoving(false);
          }
          if (puzzleLeft !== 0) {
            verifyImageVerifyMutation.mutate({
              endpoint: endpoint,
              left: puzzleLeft,
            });
          }
        }}
        onMouseLeave={() => {
          if (puzzleIsMoving) {
            setPuzzleIsMoving(false);
            setPuzzleLeft(0);
          }
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "300px",
            height: "168px",
          }}
        >
          <Box component="img" src={verifyImageNewData?.backgroud_url} />
          <Box
            component="img"
            src={verifyImageNewData?.puzzle_url}
            sx={{
              position: "absolute",
              top: verifyImageNewData?.top,
              left: puzzleLeft,
            }}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "44px",
              background: "#dddddd",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: (t) =>
                  verifyIsError ? t.palette.error.light : "#999999",
                fontSize: "0.9rem",
              }}
            >
              {verifyIsError
                ? "拼图没有对准，再试一次吧~"
                : "按住滑块，拖动完成拼图"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: puzzleLeft,
              width: "44px",
              height: "44px",
              cursor: "pointer",
              color: "black",
              background: (t) => t.palette.primary.main,
              "&:hover": {
                background: (t) => t.palette.primary.light,
              },
            }}
            onMouseDown={(e) => {
              if (puzzleClientX !== e.clientX) {
                setPuzzleClientX(e.clientX);
              }
              if (verifyIsError === true) {
                setVerifyIsError(false);
              }
              setPuzzleIsMoving(true);
            }}
            onTouchStart={(e) => {
              if (puzzleClientX !== e.targetTouches[0].pageX) {
                setPuzzleClientX(e.targetTouches[0].pageX);
              }
              if (verifyIsError === true) {
                setVerifyIsError(false);
              }
              setPuzzleIsMoving(true);
            }}
            onTouchMove={(e) => {
              if (puzzleIsMoving) {
                let left = e.targetTouches[0].pageX - puzzleClientX;
                if (left < 0) {
                  left = 0;
                } else if (left > 256) {
                  left = 256;
                }
                setPuzzleLeft(left);
              }
            }}
            onTouchEnd={() => {
              if (puzzleIsMoving) {
                setPuzzleIsMoving(false);
              }
              if (puzzleLeft !== 0) {
                verifyImageVerifyMutation.mutate({
                  endpoint: endpoint,
                  left: puzzleLeft,
                });
              }
            }}
          >
            <ChevronRight />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: puzzleLeft,
              height: "44px",
              background: (t) => t.palette.primary.main,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          {/* 状态提示 */}
          <IconButton
            onClick={() => {
              closeFn();
              if (verifyIsError === true) {
                setVerifyIsError(false);
              }
            }}
          >
            <Close />
          </IconButton>
          <IconButton
            onClick={() => {
              if (verifyIsError === true) {
                setVerifyIsError(false);
              }
              verifyImageNewMutation.mutate({ endpoint: endpoint });
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>
    </CustomPopper>
  );
};

export default VerifyImagePopper;
