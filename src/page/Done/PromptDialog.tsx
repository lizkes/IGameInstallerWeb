import { FC } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogProps,
} from "@mui/material";

type Props = DialogProps & {
  title: string;
  content: string;
  closeFn: () => void;
};

const PromptDialog: FC<Props> = ({ title, content, closeFn, ...props }) => {
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
          <Box
            sx={{
              fontSize: "1.1rem",
              lineHeight: "1.4",
              textAlign: "center",
              width: "550px",
              overflowWrap: "break-word",
              padding: "8px 24px",
            }}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <Button
            size="large"
            variant="contained"
            sx={{ marginTop: "16px", fontSize: "1.1rem", width: "100px" }}
            onClick={closeFn}
          >
            我明白
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog;
