import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

import { useAppSelector } from "@/hook";

const Title: FC = () => {
  const resourceInstallInfo = useAppSelector((s) => s.resourceInstallInfo);
  const location = useLocation();

  const [isBuying, isDone] = useMemo(() => {
    const page = location.pathname.split("/", 2)[1];
    if (page === "buy") {
      return [true, false];
    } else if (page === "done") {
      return [false, true];
    } else {
      return [false, false];
    }
  }, [location.pathname]);

  if (isBuying) {
    return null;
  }

  return (
    <Typography
      variant="h1"
      sx={{
        fontSize: "1.6rem",
        lineHeight: "1.4",
        textAlign: "center",
        fontWeight: "400",
        marginTop: "16px",
        color: (t) =>
          isDone ? t.palette.success.light : t.palette.primary.light,
      }}
    >
      {isDone
        ? `${resourceInstallInfo.type === "game" ? "游戏" : "拓展"}《${
            resourceInstallInfo.name
          }》安装成功`
        : `正在安装${resourceInstallInfo.type === "game" ? "游戏" : "拓展"}《${
            resourceInstallInfo.name
          }》`}
    </Typography>
  );
};

export default Title;
