import { FC, ReactNode } from "react";
import {
  Box,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  SxProps,
  Theme,
  PopperProps,
} from "@mui/material";
import { VirtualElement, Placement } from "@popperjs/core";

type Props = {
  children: ReactNode;
  anchorEl: VirtualElement | (() => VirtualElement) | null | undefined;
  isOpen: boolean;
  closeFn: (event: MouseEvent | TouchEvent) => void;
  placement?: Placement;
  transformOrigin?:
    | "bottom"
    | "center"
    | "left"
    | "right"
    | "top"
    | (string & {});
  paperSx?: SxProps<Theme>;
  clickAwayEnable?: boolean;
  popperProps?: PopperProps;
};
const CustomPopper: FC<Props> = ({
  anchorEl,
  isOpen,
  closeFn,
  children,
  placement = "bottom",
  transformOrigin = "top",
  paperSx,
  clickAwayEnable = true,
  popperProps,
}) => {
  return (
    <Popper
      anchorEl={anchorEl}
      open={isOpen}
      transition
      placement={placement}
      style={{
        zIndex: 5000,
      }}
      {...popperProps}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: transformOrigin,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "16px",
              ...paperSx,
            }}
          >
            {clickAwayEnable ? (
              <ClickAwayListener onClickAway={closeFn}>
                <Box>{children}</Box>
              </ClickAwayListener>
            ) : (
              <Box>{children}</Box>
            )}
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default CustomPopper;
