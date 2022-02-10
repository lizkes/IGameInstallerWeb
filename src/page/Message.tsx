import { FC, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReportGmailerrorredOutlined } from "@mui/icons-material";

import BasePage from "@/page/Base";
import CountDownButton from "@/component/CountDownButton";

type Props = {
  variant: "error" | "installWarn" | "info";
  title?: string;
  content: string;
  contentFontSize?: string;
  picture?: string;
  buttonCountDownText?: string;
  buttonText?: string;
  buttonClickFn?: () => void;
  buttonCountDownSeconds?: number;
};

const MessagePage: FC<Props> = ({
  variant,
  title,
  content,
  contentFontSize = "1.1rem",
  picture,
  buttonCountDownText,
  buttonText,
  buttonClickFn,
  buttonCountDownSeconds,
}) => {
  const theme = useTheme();
  const replacedContent = useMemo(() => {
    return content.replace(/\n/g, "<br />");
  }, [content]);
  const fontColor = useMemo(() => {
    if (variant === "error" || variant === "installWarn") {
      return theme.palette.error.light;
    } else {
      return theme.palette.primary.light;
    }
  }, [variant, theme]);
  const [countDownIsRunning, setCountDownIsRunning] = useState<boolean>(
    buttonCountDownSeconds === undefined ? false : true
  );

  if (variant === "installWarn") {
    return (
      <BasePage variant="center">
        <Box sx={{ flexGrow: 1 }} />
        {title !== undefined ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: fontColor,
            }}
          >
            <ReportGmailerrorredOutlined
              sx={{
                fontSize: "1.8rem",
                lineHeight: "1.4",
                marginRight: "2px",
              }}
            />
            <Typography
              fontWeight={400}
              sx={{
                textAlign: "center",
                fontSize: "1.8rem",
                lineHeight: "1.4",
              }}
            >
              {title}
            </Typography>
          </Box>
        ) : null}
        {picture === undefined ? null : (
          <img
            src={picture}
            style={{
              width: "120px",
            }}
          />
        )}
        <Box sx={{ flexGrow: 2 }} />
        <Box
          sx={{
            fontSize: contentFontSize,
            lineHeight: "1.4",
            textAlign: "center",
            width: "600px",
            overflowWrap: "break-word",
            color: fontColor,
          }}
          dangerouslySetInnerHTML={{
            __html: replacedContent,
          }}
        />
        {buttonText !== undefined ? (
          <>
            <Box sx={{ flexGrow: 2 }} />
            <CountDownButton
              size="large"
              variant="contained"
              sx={{
                fontSize: "1.1rem",
                letterSpacing: "0.06rem",
                backgroundColor: (t) => t.palette.success.light,
                transition: "all 150ms",
                ":hover": {
                  background: (t) => t.palette.success.light,
                  filter: "brightness(0.9)",
                },
              }}
              countDownSeconds={buttonCountDownSeconds ?? 0}
              countDownIsRunning={countDownIsRunning}
              countDownStopFn={() => setCountDownIsRunning(false)}
              countDownText={buttonCountDownText}
              onClick={buttonClickFn}
            >
              {buttonText}
            </CountDownButton>
          </>
        ) : null}
        <Box sx={{ flexGrow: 2 }} />
      </BasePage>
    );
  } else if (variant === "error") {
    return (
      <BasePage variant="center">
        <Box sx={{ flexGrow: 3 }} />
        {title !== undefined ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: fontColor,
              marginBottom: "16px",
            }}
          >
            <ReportGmailerrorredOutlined
              sx={{
                fontSize: "1.8rem",
                lineHeight: "1.4",
                marginRight: "2px",
              }}
            />
            <Typography
              variant="h1"
              fontWeight={400}
              sx={{
                fontSize: "1.8rem",
                lineHeight: "1.4",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          </Box>
        ) : null}
        <Box
          sx={{
            fontSize: contentFontSize,
            lineHeight: "1.4",
            textAlign: "center",
            width: "600px",
            overflowWrap: "break-word",
            color: fontColor,
          }}
          dangerouslySetInnerHTML={{
            __html: replacedContent,
          }}
        />
        {buttonText !== undefined ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <CountDownButton
              size="large"
              variant="contained"
              sx={{
                fontSize: "1.1rem",
                letterSpacing: "0.06rem",
                minWidth: "120px",
                backgroundColor: (t) => t.palette.success.light,
                transition: "all 150ms",
                ":hover": {
                  background: (t) => t.palette.success.light,
                  filter: "brightness(0.9)",
                },
              }}
              countDownSeconds={buttonCountDownSeconds ?? 0}
              countDownIsRunning={countDownIsRunning}
              countDownStopFn={() => setCountDownIsRunning(false)}
              countDownText={buttonCountDownText}
              onClick={buttonClickFn}
            >
              {buttonText}
            </CountDownButton>
          </>
        ) : null}
        <Box sx={{ flexGrow: 3 }} />
      </BasePage>
    );
  } else {
    return null;
  }
};

export default MessagePage;
