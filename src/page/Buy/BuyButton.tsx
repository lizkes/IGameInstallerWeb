import { FC, useMemo, useCallback } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useModal } from "mui-modal-provider";

import AlipayLogo from "@public/AlipayLogo.png";
import WepayLogo from "@public/WepayLogo.png";

import AlipayDialog from "./AliPayDialog";

type Props = {
  variant: "alipay" | "wepay";
  goodId: number;
  goodAmount: number;
};

const BuyButton: FC<Props> = ({ variant, goodId, goodAmount }) => {
  const { showModal } = useModal();
  const [LogoSrc, text] = useMemo(() => {
    if (variant === "alipay") {
      return [AlipayLogo, "支付宝付款"];
    } else {
      return [WepayLogo, "微信付款"];
    }
  }, [variant]);

  const buttonClick = useCallback(() => {
    const modal = showModal(AlipayDialog, {
      goodId: goodId,
      goodAmount: goodAmount,
      closeFn: () => {
        modal.hide();
      },
    });
  }, [goodId, goodAmount, showModal]);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "120px",
        height: "120px",
        marginRight: "16px",
        cursor: "pointer",
        "&:hover": {
          filter: "brightness(90%)",
        },
        transition: "all 150ms",
      }}
      elevation={6}
      onClick={buttonClick}
    >
      <Box
        component="img"
        src={LogoSrc}
        sx={{
          width: "60px",
          height: "60px",
          margin: "8px 0 4px 0",
        }}
      />
      <Typography
        sx={{
          fontWeight: 400,
        }}
      >
        {text}
      </Typography>
    </Paper>
  );
};

export default BuyButton;
