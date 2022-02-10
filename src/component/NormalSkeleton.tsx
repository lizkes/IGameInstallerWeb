import { FC } from "react";
import { Skeleton, Fade, Box, SxProps, Theme } from "@mui/material";

type Props = {
  delay?: string;
  sx?: SxProps<Theme>;
  skeletonColor?: any;
};

const NormalSkeleton: FC<Props> = ({ delay = "300ms", sx }) => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      ...sx,
    }}
  >
    <Fade in style={{ transitionDelay: delay }}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </Fade>
  </Box>
);

export default NormalSkeleton;
