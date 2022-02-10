import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import { setDownloadUrl } from "@/slice/appSlice";
import { useAppDispatch, useAppSelector, useSnackbar } from "@/hook";
import { useResourceDownloadUrlMutation } from "@/api/resource";
import { handleAxiosError } from "@/util/errorHandler";

type Props = DialogProps & {
  title: string;
  content: string;
  variant: "normal" | "fast";
  closeFn: () => void;
};

const OkDialog: FC<Props> = ({
  title,
  content,
  variant,
  closeFn,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sendSnackbar = useSnackbar();
  const resourceInstallInfo = useAppSelector((s) => s.resourceInstallInfo);

  // 获取资源链接
  const resourceUrlMutation = useResourceDownloadUrlMutation({
    onError: (error) => {
      const errorInfo = handleAxiosError(error);
      sendSnackbar("获取资源下载链接失败", errorInfo.content, "error");
    },
  });
  // 处理获取数据
  useEffect(() => {
    if (resourceUrlMutation.data) {
      closeFn();
      dispatch(setDownloadUrl(resourceUrlMutation.data.data.download_url));
      navigate("/install");
    }
  }, [resourceUrlMutation.data, closeFn, dispatch, navigate]);

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
          fontSize: {
            default: "1.3rem",
            large: "1.6rem",
          },
          color: (t) => t.palette.primary.light,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              lineHeight: "1.4",
              textAlign: "center",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          >
            {content}
          </Typography>
          <LoadingButton
            loading={resourceUrlMutation.isLoading}
            size="large"
            variant="contained"
            sx={{
              marginTop: "24px",
              fontSize: "1.1rem",
              width: "100px",
              backgroundColor: (t) => t.palette.success.light,
              transition: "all 150ms",
              ":hover": {
                background: (t) => t.palette.success.light,
                filter: "brightness(0.9)",
              },
            }}
            onClick={() => {
              resourceUrlMutation.mutate({
                resourceId: resourceInstallInfo.id,
                providerGroup: variant,
              });
            }}
          >
            下载
          </LoadingButton>
          <Button
            disabled={resourceUrlMutation.isLoading}
            size="large"
            variant="contained"
            color="error"
            sx={{ marginTop: "12px", fontSize: "1.1rem", width: "100px" }}
            onClick={closeFn}
          >
            返回
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OkDialog;
