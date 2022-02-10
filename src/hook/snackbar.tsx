import { forwardRef, useCallback, ReactNode } from "react";
import {
  SnackbarContent,
  useSnackbar as useNotistackSnackbar,
} from "notistack";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close, Done, ErrorOutline, InfoOutlined } from "@mui/icons-material";

type SnackbarVariant = "info" | "success" | "error";

const Snakebar = forwardRef<
  HTMLDivElement,
  { id: string | number; message: string | ReactNode; variant: SnackbarVariant }
>(function SnakeBar({ id, message, variant }, ref) {
  const { closeSnackbar } = useNotistackSnackbar();
  const theme = useTheme();
  const breakpointUpLarge = useMediaQuery(theme.breakpoints.up("large"), {
    noSsr: true,
  });
  let title = "标题";
  let content = "内容";
  if (typeof message === "string") {
    const i = message.indexOf("|");
    title = message.slice(0, i);
    content = message.slice(i + 1);
  }

  const handleClose = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent
      ref={ref}
      style={{
        width: breakpointUpLarge ? "320px" : "260px",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          color: "white",
          backgroundColor: (t) => {
            if (variant === "info") {
              return t.palette.primary.main;
            }
            if (variant === "success") {
              return t.palette.success.main;
            }
            if (variant === "error") {
              return t.palette.error.main;
            }
          },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: "0px",
            right: "0px",
            height: "40px",
            width: "40px",
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflowWrap: "break-word",
            padding: "16px 56px 8px 16px",
          }}
        >
          {(() => {
            if (variant === "info") {
              return (
                <InfoOutlined
                  sx={{
                    marginRight: "4px",
                  }}
                />
              );
            }
            if (variant === "error") {
              return (
                <ErrorOutline
                  sx={{
                    marginRight: "4px",
                  }}
                />
              );
            }
            if (variant === "success") {
              return (
                <Done
                  sx={{
                    marginRight: "4px",
                  }}
                />
              );
            }
          })()}
          <Typography
            sx={{
              fontSize: {
                default: "1.2rem",
                large: "1.3rem",
              },
              fontWeight: 400,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          sx={{
            width: "100%",
            padding: "0px 16px 16px 16px",
            overflowWrap: "break-word",
            whiteSpace: "pre-line",
            fontWeight: 300,
          }}
        >
          {content}
        </Typography>
      </Paper>
    </SnackbarContent>
  );
});

const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistackSnackbar();
  return (title: string, content: string, variant: SnackbarVariant) =>
    enqueueSnackbar(`${title}|${content}`, {
      content: (key, message) => (
        <Snakebar id={key} message={message} variant={variant} />
      ),
      autoHideDuration: variant === "error" ? 8000 : 5000,
      persist: false,
    });
};

export { useSnackbar };
