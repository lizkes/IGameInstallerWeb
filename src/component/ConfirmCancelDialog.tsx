import { FC } from "react";
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
  confirmText: string;
  confirmFn: () => void;
  cancelText: string;
  cancelFn: () => void;
  titleText: string;
  contentText: string;
};

const ConfirmCancelDialog: FC<Props> = ({
  confirmText,
  confirmFn,
  cancelText,
  cancelFn,
  titleText,
  contentText,
  ...props
}) => {
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
        {titleText}
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
                large: "1.3rem",
              },
              width: "100%",
              textAlign: "center",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
            }}
          >
            {contentText}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "24px",
            }}
          >
            <Button variant="contained" color="error" onClick={cancelFn}>
              {cancelText}
            </Button>
            <Button variant="contained" color="success" onClick={confirmFn}>
              {confirmText}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmCancelDialog;
