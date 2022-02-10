import { FC, MouseEventHandler } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

import BasePage from "@/page/Base";

type Props = {
  message: string;
  canRetry?: boolean;
  retryOnClick?: MouseEventHandler<HTMLButtonElement>;
};

const WaitingPage: FC<Props> = ({
  message,
  canRetry = false,
  retryOnClick = () => {},
}) => {
  return (
    <BasePage variant="center">
      <Box sx={{ flexGrow: 4 }} />
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
        <CircularProgress size={64} />
        <Typography
          variant="h1"
          sx={{
            fontSize: "1.5rem",
            lineHeight: "1.6",
            textAlign: "center",
            fontWeight: "400",
            marginTop: "16px",
          }}
        >
          {message}
        </Typography>
      </Box>
      {canRetry ? (
        <Button size="large" variant="contained" onClick={retryOnClick}>
          重试
        </Button>
      ) : null}
      <Box sx={{ flexGrow: 5 }} />
    </BasePage>
  );
};

export default WaitingPage;
