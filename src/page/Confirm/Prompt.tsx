import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

type PromptProps = {
  message: string;
  buttonVariant?: "login" | "buyVip" | "none";
};
const Prompt: FC<PromptProps> = ({ message, buttonVariant = "none" }) => {
  const navigate = useNavigate();

  let button;
  if (buttonVariant === "login") {
    button = (
      <Button
        variant="contained"
        size="large"
        sx={{
          fontSize: "1.1rem",
          width: "120px",
          backgroundColor: (t) => t.palette.success.light,
          transition: "all 150ms",
          ":hover": {
            background: (t) => t.palette.success.light,
            filter: "brightness(0.9)",
          },
        }}
        onClick={() => {
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
          fontSize: "1.1rem",
          width: "120px",
          backgroundColor: (t) => t.palette.secondary.light,
          transition: "all 150ms",
          ":hover": {
            background: (t) => t.palette.secondary.light,
            filter: "brightness(0.9)",
          },
        }}
        onClick={() => {
          navigate("/buy/vip");
        }}
      >
        成为会员
      </Button>
    );
  } else {
    button = null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "16px 0",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: "1.2rem",
          lineHeight: "1.6",
          textAlign: "center",
          whiteSpace: "pre-line",
          marginBottom: "16px",
        }}
      >
        {message}
      </Typography>
      {button}
    </Box>
  );
};

export default Prompt;
