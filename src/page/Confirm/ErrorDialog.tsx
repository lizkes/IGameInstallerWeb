import { FC, MouseEventHandler } from "react";
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

type Props = DialogProps & {
  closeFn: MouseEventHandler<HTMLButtonElement>;
  title: string;
  content: string;
  buttonVariant: "login" | "buyVip" | "none";
};

const ErrorDialog: FC<Props> = ({
  title,
  content,
  buttonVariant,
  closeFn,
  ...props
}) => {
  const navigate = useNavigate();
  let button = null;
  if (buttonVariant === "login") {
    button = (
      <Button
        variant="contained"
        size="large"
        sx={{
          marginTop: "24px",
          fontSize: "1.1rem",
          width: "120px",
          backgroundColor: (t) => t.palette.success.light,
          transition: "all 150ms",
          ":hover": {
            background: (t) => t.palette.success.light,
            filter: "brightness(0.9)",
          },
        }}
        onClick={(e) => {
          closeFn(e);
          navigate("/login");
        }}
      >
        用户登录
      </Button>
    );
  } else if (buttonVariant === "buyVip") {
    button = (
      <Button
        variant="contained"
        size="large"
        sx={{
          marginTop: "24px",
          fontSize: "1.1rem",
          width: "120px",
          backgroundColor: (t) => t.palette.secondary.light,
          transition: "all 150ms",
          ":hover": {
            background: (t) => t.palette.secondary.light,
            filter: "brightness(0.9)",
          },
        }}
        onClick={(e) => {
          closeFn(e);
          navigate("/buy/vip");
        }}
      >
        成为会员
      </Button>
    );
  }

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
          color: (t) => t.palette.error.light,
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
            margin: "8px 0",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                default: "1.2rem",
              },
              lineHeight: "1.4",
              textAlign: "center",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          >
            {content}
          </Typography>
          {button}
          <Button
            size="large"
            variant="contained"
            color="error"
            sx={{ marginTop: "12px", fontSize: "1.1rem", width: "120px" }}
            onClick={closeFn}
          >
            返回
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
