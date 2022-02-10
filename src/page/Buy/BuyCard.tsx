import { FC } from "react";
import { Box, Typography, Paper, SxProps, Divider } from "@mui/material";

type Props = {
  boxSxProps: SxProps;
  cost: number;
  description: string;
  name: string;
  selected: boolean;
  onClickFn: () => void;
};

const BuyCard: FC<Props> = ({
  boxSxProps,
  cost,
  description,
  name,
  selected,
  onClickFn,
}) => {
  return (
    <Box sx={boxSxProps}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          border: (t) =>
            `2px solid ${selected ? t.palette.secondary.light : "white"}`,
          "&:hover": {
            filter: "brightness(90%)",
          },
          transition: "all 150ms",
        }}
        onClick={onClickFn}
        elevation={6}
      >
        <Box
          sx={{
            display: "flex",
            margin: "32px 0 0 0",
            alignItems: "end",
          }}
        >
          <Typography
            sx={{
              fontSize: "2.5rem",
              lineHeight: "1",
              color: (t) => t.palette.secondary.light,
            }}
          >
            {cost}
          </Typography>
          <Typography
            sx={{
              filter: "opacity(50%)",
              lineHeight: "1",
              paddingBottom: "0.2rem",
            }}
          >
            元
          </Typography>
        </Box>
        <Typography
          sx={{
            margin: "0 0 32px 0",
            fontSize: "0.9rem",
            filter: "opacity(50%)",
          }}
        >
          {description}
        </Typography>
        <Divider
          sx={{
            width: "100%",
          }}
        />
        <Typography
          sx={{
            margin: "16px 0",
          }}
        >
          {name}
        </Typography>
      </Paper>
    </Box>
  );
};

export default BuyCard;
