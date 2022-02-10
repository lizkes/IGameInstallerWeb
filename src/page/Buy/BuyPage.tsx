import { useMemo, useState, FC, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Favorite, Download, LockOpen } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useModal } from "mui-modal-provider";

import { BasePage } from "@/page";
import { useAppSelector } from "@/hook";
import ConfirmCancelDialog from "@/component/ConfirmCancelDialog";
import { getUserIdFromToken } from "@/util/tokenHandler";

import BuyCard from "./BuyCard";
import BuyButton from "./BuyButton";
import NavigateButtonGroup from "@/component/NavigateButtonGroup";

type Props = {
  variant: "vip" | "coin";
};

const BuyPage: FC<Props> = ({ variant }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const userId = useAppSelector((s) => s.user.userId);
  const { showModal } = useModal();
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const goodId = useMemo(() => {
    if (variant === "vip") {
      return selectedCard;
    } else {
      return selectedCard + 4;
    }
  }, [selectedCard, variant]);

  useEffect(() => {
    if (userId === 0) {
      const userIdFromToken = getUserIdFromToken() ?? 0;
      if (userIdFromToken === 0) {
        const modal = showModal(ConfirmCancelDialog, {
          confirmText: "登录",
          confirmFn: () => {
            navigate("/login");
            modal.hide();
          },
          cancelText: "返回",
          cancelFn: () => {
            navigate(-1);
            modal.hide();
          },
          titleText: "您尚未登录",
          contentText: "您尚未登录，无法访问本网页",
        });
      }
    }
  }, [showModal, navigate, userId]);

  return (
    <BasePage>
      <BasePage maxWidth={theme.breakpoints.values.tablet}>
        <Box sx={{ flexGrow: 1 }} />
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
          elevation={6}
        >
          <Typography sx={{ fontSize: "1.5rem", marginBottom: "4px" }}>
            成为IGame会员后您可以：
          </Typography>
          <Box>
            <Box
              sx={{
                display: "flex",
                padding: "2px",
              }}
            >
              <LockOpen color="primary" sx={{ marginRight: "2px" }} />
              <Typography>浏览全部资源，不受等级限制</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                padding: "2px",
              }}
            >
              <Download color="primary" sx={{ marginRight: "2px" }} />
              <Typography>下载所有资源，不消耗无限币</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                padding: "2px",
              }}
            >
              <Favorite
                color="primary"
                sx={{
                  marginRight: "2px",
                }}
              />
              <Typography>支持我们继续维护本软件</Typography>
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            width: "calc(100% + 16px)",
            margin: "0 -8px 16px -8px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <BuyCard
            cost={24}
            description="0.8元/天"
            name="1个月IGame会员"
            selected={selectedCard === 1}
            onClickFn={() => setSelectedCard(1)}
            boxSxProps={{
              padding: "8px 8px",
              width: {
                default: "100%",
                phone: "50%",
                pad: "25%",
              },
            }}
          />
          <BuyCard
            cost={68}
            description="0.75元/天"
            name="3个月IGame会员"
            selected={selectedCard === 2}
            onClickFn={() => setSelectedCard(2)}
            boxSxProps={{
              padding: "8px 8px",
              width: {
                default: "100%",
                phone: "50%",
                pad: "25%",
              },
            }}
          />
          <BuyCard
            cost={180}
            description="0.5元/天"
            name="12个月IGame会员"
            selected={selectedCard === 3}
            onClickFn={() => setSelectedCard(3)}
            boxSxProps={{
              padding: "8px 8px",
              width: {
                default: "100%",
                phone: "50%",
                pad: "25%",
              },
            }}
          />
          <BuyCard
            cost={7}
            description="1元/天"
            name="7天IGame会员"
            selected={selectedCard === 4}
            onClickFn={() => setSelectedCard(4)}
            boxSxProps={{
              padding: "8px 8px",
              width: {
                default: "100%",
                phone: "50%",
                pad: "25%",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BuyButton variant="alipay" goodId={goodId} goodAmount={1} />
        </Box>
        <Box sx={{ flexGrow: 3 }} />
      </BasePage>
      <NavigateButtonGroup
        canBack={true}
        backOnClick={() => {
          navigate(-1);
        }}
        backValue="返回"
      />
    </BasePage>
  );
};

export default BuyPage;
