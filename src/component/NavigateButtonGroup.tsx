import { FC, MouseEventHandler } from "react";
import { Box, Button } from "@mui/material";

type Props = {
  canBack?: boolean;
  backOnClick?: MouseEventHandler<HTMLButtonElement>;
  backValue?: string;
  backDisable?: boolean;
  canNext?: boolean;
  nextOnClick?: MouseEventHandler<HTMLButtonElement>;
  nextValue?: string;
  nextDisable?: boolean;
};

const NavigateButtonGroup: FC<Props> = ({
  canBack = false,
  backOnClick = () => {},
  backValue = "上一步",
  backDisable = false,
  canNext = false,
  nextOnClick = () => {},
  nextValue = "下一步",
  nextDisable = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        padding: "0px 32px 32px 32px",
      }}
    >
      {canBack ? (
        <Button
          variant="contained"
          size="large"
          disabled={backDisable}
          sx={{
            width: "100px",
            fontSize: "1.1rem",
            backgroundColor: (t) => t.palette.success.light,
            transition: "all 150ms",
            ":hover": {
              background: (t) => t.palette.success.light,
              filter: "brightness(0.9)",
            },
          }}
          onClick={backOnClick}
        >
          {backValue}
        </Button>
      ) : null}

      <Box sx={{ flexGrow: 1 }} />
      {canNext ? (
        <Button
          variant="contained"
          size="large"
          disabled={nextDisable}
          sx={{
            width: "100px",
            fontSize: "1.1rem",
            backgroundColor: (t) => t.palette.success.light,
            transition: "all 150ms",
            ":hover": {
              background: (t) => t.palette.success.light,
              filter: "brightness(0.9)",
            },
          }}
          onClick={nextOnClick}
        >
          {nextValue}
        </Button>
      ) : null}
    </Box>
  );
};

export default NavigateButtonGroup;
