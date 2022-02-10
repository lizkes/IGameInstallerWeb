import { FC, useEffect, useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useModal } from "mui-modal-provider";

import { useAppSelector } from "@/hook";
import { formatBytes } from "@/util/numberHandler";
import WebSendMessage from "@/model/WebSendMessage";
import WebRecvMessage, { InstallConfigPayload } from "@/model/WebRecvMessage";
import BasePage from "@/page/Base";
import WaitingPage from "@/page/Waiting";
import NavigateButtonGroup from "@/component/NavigateButtonGroup";

import PromptDialog from "./PromptDialog";

const ConfigPage: FC = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const resourceInstallInfo = useAppSelector((s) => s.resourceInstallInfo);
  const [needGenerate, setNeedGenerate] = useState<boolean>(true);
  const [installConfigPayload, setInstallConfigPayload] = useState<
    InstallConfigPayload | undefined
  >(undefined);
  const [promptIsShow, setPromptIsShow] = useState<boolean>(false);

  const setInstallConfig = useCallback(() => {
    const sendMessage: WebSendMessage = {
      type: "setInstallConfig",
      payload: JSON.stringify(installConfigPayload),
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
  }, [installConfigPayload]);

  useEffect(() => {
    if (needGenerate) {
      const sendMessage: WebSendMessage = {
        type: "generateInstallConfig",
        payload: "",
      };
      window.chrome.webview.postMessage(JSON.stringify(sendMessage));
      setNeedGenerate(false);
    }
  }, [needGenerate]);
  useEffect(() => {
    const handle = (e: { data: string }) => {
      const recvMessage: WebRecvMessage = JSON.parse(e.data);
      if (recvMessage.type === "setInstallConfig") {
        const payload: InstallConfigPayload = JSON.parse(recvMessage.payload);
        setInstallConfigPayload(payload);
      }
    };
    window.chrome.webview.addEventListener("message", handle);
    return () => {
      window.chrome.webview.removeEventListener("message", handle);
    };
  });
  useEffect(() => {
    if (
      !promptIsShow &&
      resourceInstallInfo.postInstallPrompt !== "" &&
      resourceInstallInfo.postInstallPrompt !== null
    ) {
      setPromptIsShow(true);
      const modal = showModal(PromptDialog, {
        title: "安装前说明",
        content: resourceInstallInfo.postInstallPrompt,
        closeFn: () => {
          modal.hide();
        },
      });
    }
  }, [promptIsShow, resourceInstallInfo.postInstallPrompt, showModal]);

  if (installConfigPayload) {
    return (
      <BasePage variant="center">
        <Box sx={{ flexGrow: 5 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FormControl
              sx={{
                width: "580px",
              }}
              variant="outlined"
              error={
                installConfigPayload.errorMessage !== null &&
                installConfigPayload.errorMessage !== ""
              }
            >
              <InputLabel>{installConfigPayload.inputLabel}</InputLabel>
              <OutlinedInput
                readOnly
                autoFocus
                label={installConfigPayload.inputLabel}
                sx={{
                  marginBottom: "4px",
                }}
                value={installConfigPayload.installPath}
              />
            </FormControl>
            <Button
              variant="contained"
              disabled={installConfigPayload.installPathIsImmutable}
              sx={{
                fontSize: "1.1rem",
                marginLeft: "8px",
                height: "56px",
                width: "120px",
                backgroundColor: (t) => t.palette.primary.light,
                transition: "all 150ms",
                ":hover": {
                  background: (t) => t.palette.primary.light,
                  filter: "brightness(0.9)",
                },
              }}
              onClick={() => {
                const sendMessage: WebSendMessage = {
                  type: "getInstallPath",
                  payload: "",
                };
                window.chrome.webview.postMessage(JSON.stringify(sendMessage));
              }}
            >
              选择路径
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              {installConfigPayload.successMessage !== null &&
              installConfigPayload.successMessage !== "" ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    margin: "0px 14px",
                    color: (t) => t.palette.success.light,
                  }}
                >
                  {installConfigPayload.successMessage}
                </Typography>
              ) : null}
              {installConfigPayload.infoMessage !== null &&
              installConfigPayload.infoMessage !== "" ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    margin: "0px 14px",
                    color: (t) => t.palette.info.light,
                  }}
                >
                  {installConfigPayload.infoMessage}
                </Typography>
              ) : null}
              {installConfigPayload.errorMessage !== null &&
              installConfigPayload.errorMessage !== "" ? (
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    margin: "0px 14px",
                    color: (t) => t.palette.error.light,
                  }}
                >
                  {installConfigPayload.errorMessage}
                </Typography>
              ) : null}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.9rem",
                }}
              >{`安装所需空间：${formatBytes(
                resourceInstallInfo.requireDisk
              )}`}</Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                }}
              >{`磁盘剩余空间：${formatBytes(
                installConfigPayload.diskFreeSpace
              )}`}</Typography>
            </Box>
          </Box>
          {resourceInstallInfo.type === "game" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "start",
                userSelect: "none",
                marginTop: "8px",
              }}
            >
              <FormControlLabel
                sx={{
                  margin: "2px 0px",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.95rem",
                  },
                }}
                control={
                  <Checkbox
                    sx={{
                      padding: "0px",
                      marginTop: "-2px",
                    }}
                    checked={installConfigPayload.needDesktopShortcut}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setInstallConfigPayload({
                        ...installConfigPayload,
                        needDesktopShortcut: event.target.checked,
                      })
                    }
                  />
                }
                label="添加桌面快捷方式"
              />
              <FormControlLabel
                sx={{
                  margin: "2px 0px",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.95rem",
                  },
                }}
                control={
                  <Checkbox
                    sx={{
                      padding: "0px",
                      marginTop: "-2px",
                    }}
                    checked={installConfigPayload.needStartmenuShortcut}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setInstallConfigPayload({
                        ...installConfigPayload,
                        needStartmenuShortcut: event.target.checked,
                      })
                    }
                  />
                }
                label="添加开始菜单快捷方式"
              />
            </Box>
          ) : null}
        </Box>
        <Box sx={{ flexGrow: 5 }} />
        <NavigateButtonGroup
          canNext={true}
          nextOnClick={() => {
            setInstallConfig();
            navigate("/confirm");
          }}
          nextValue="下一步"
          nextDisable={
            installConfigPayload.errorMessage !== null &&
            installConfigPayload.errorMessage !== ""
          }
        />
      </BasePage>
    );
  }

  return <WaitingPage message="正在智能选择安装路径..." />;
};

export default ConfigPage;
