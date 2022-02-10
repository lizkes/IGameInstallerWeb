import { FC, useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  DialogProps,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import QRCode from "qrcode.react";
import { useQueryClient } from "react-query";

import NormalSkeleton from "@/component/NormalSkeleton";
import { useAppSelector, useSnackbar } from "@/hook";
import {
  useAliPayPrecreateMutation,
  useAlipayQueryMutation,
} from "@/api/alipay";
import { handleAxiosError } from "@/util/errorHandler";
import Logo from "@public/Logo.png";

type Props = DialogProps & {
  closeFn: () => void;
  goodId: number;
  goodAmount: number;
};

const AlipayDialog: FC<Props> = ({ closeFn, goodId, goodAmount, ...props }) => {
  const sendSnackbar = useSnackbar();
  const queryClient = useQueryClient();
  const userId = useAppSelector((s) => s.user.userId);
  const [qrcodeIsValid, setQrcodeIsValid] = useState<boolean>(false);
  // 获取预交易信息
  const aliPayPrecreateMutation = useAliPayPrecreateMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("获取付款码失败", errorInfo.content, "error");
    },
  });
  // 查询支付宝交易状态
  const alipayQueryMutation = useAlipayQueryMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("查询交易失败", errorInfo.content, "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userInfo", userId]);
    },
  });

  // 处理获取数据
  const aliPayPrecreateData = useMemo(() => {
    if (aliPayPrecreateMutation.data) {
      return aliPayPrecreateMutation.data.data;
    }
    return null;
  }, [aliPayPrecreateMutation.data]);
  const alipayQueryData = useMemo(() => {
    if (alipayQueryMutation.data) {
      return alipayQueryMutation.data.data;
    }
    return null;
  }, [alipayQueryMutation.data]);

  useEffect(() => {
    if (!qrcodeIsValid) {
      setQrcodeIsValid(true);
      aliPayPrecreateMutation.mutate({
        goodId: goodId,
        goodAmount: goodAmount,
      });
    }
  }, [qrcodeIsValid, aliPayPrecreateMutation, goodId, goodAmount]);

  return (
    <Dialog
      fullWidth
      maxWidth="large"
      {...props}
      // 阻止点击外部关闭行为
      onClose={() => {
        return;
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.6rem",
          color: (t) => t.palette.primary.light,
        }}
      >
        {alipayQueryData === null ? "支付宝付款" : "付款成功"}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "16px 0 8px 0",
          }}
        >
          {alipayQueryData === null ? (
            aliPayPrecreateData === null ? (
              <NormalSkeleton sx={{ height: "332px" }} />
            ) : (
              <>
                <QRCode
                  value={aliPayPrecreateData?.qr_code!}
                  size={300}
                  renderAs="svg"
                  imageSettings={{
                    src: Logo,
                    height: 48,
                    width: 48,
                    excavate: true,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    textAlign: "center",
                    marginTop: "8px",
                    fontWeight: "400",
                    filter: "opacity(0.7)",
                  }}
                >
                  手机打开支付宝APP，扫码支付
                </Typography>
              </>
            )
          ) : (
            <Typography
              sx={{
                fontSize: "1.3rem",
                textAlign: "center",
                overflowWrap: "break-word",
                color: (t) => t.palette.primary.light,
              }}
            >
              支付成功
              <br />
              感谢您对IGame的大力支持
            </Typography>
          )}
          {alipayQueryData === null ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "32px",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "120px",
                  fontSize: "1.1rem",
                  backgroundColor: (t) => t.palette.error.main,
                  transition: "all 150ms",
                  ":hover": {
                    background: (t) => t.palette.error.main,
                    filter: "brightness(0.9)",
                  },
                }}
                onClick={closeFn}
              >
                取消
              </Button>
              <LoadingButton
                variant="contained"
                size="large"
                sx={{
                  width: "120px",
                  fontSize: "1.1rem",
                  backgroundColor: (t) => t.palette.success.light,
                  transition: "all 150ms",
                  ":hover": {
                    background: (t) => t.palette.success.light,
                    filter: "brightness(0.9)",
                  },
                }}
                loading={alipayQueryMutation.isLoading}
                disabled={aliPayPrecreateData?.order_id === undefined}
                onClick={() => {
                  alipayQueryMutation.mutate({
                    orderId: aliPayPrecreateData?.order_id!,
                  });
                }}
              >
                我已支付
              </LoadingButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "32px",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "120px",
                  fontSize: "1.1rem",
                  backgroundColor: (t) => t.palette.success.light,
                  transition: "all 150ms",
                  ":hover": {
                    background: (t) => t.palette.success.light,
                    filter: "brightness(0.9)",
                  },
                }}
                onClick={closeFn}
              >
                完成
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AlipayDialog;
