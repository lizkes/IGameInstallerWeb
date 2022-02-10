import {
  useState,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  FC,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Container,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { blue } from "@mui/material/colors";
import { VisibilityOff, Visibility } from "@mui/icons-material";

import { useAppDispatch, useAppSelector, useSnackbar } from "@/hook";
import { useUserLoginMutation } from "@/api/user";
import { setUserId } from "@/slice/userSlice";
import { handleAxiosError } from "@/util/errorHandler";
import { setAccessToken, setRefreshToken } from "@/util/localStorageHandler";
import VerifyImagePopper from "@/component/VerifyImagePopper";
import NavigateButtonGroup from "@/component/NavigateButtonGroup";
import BasePage from "./Base";

type BaseState = {
  emailIsError: boolean;
  emailErrorMessage: string;
  passwordIsError: boolean;
  passwordErrorMessage: string;
  passwordIsShow: boolean;
  userLoginRspIsHandled: boolean;
};
type VerifyImageState = {
  isOpen: boolean;
  needFetch: boolean;
};

const LoginPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sendSnackbar = useSnackbar();
  const userId = useAppSelector((s) => s.user.userId);

  const [state, setState] = useState<BaseState>({
    emailIsError: false,
    emailErrorMessage: "默认错误",
    passwordIsError: false,
    passwordErrorMessage: "默认错误",
    passwordIsShow: false,
    userLoginRspIsHandled: false,
  });
  const [verifyImageState, setVerifyImageState] = useState<VerifyImageState>({
    isOpen: false,
    needFetch: true,
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  const emailRegexp = useMemo(
    () =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    []
  );
  const passwordRegexp = useMemo(
    // eslint-disable-next-line no-useless-escape
    () => /^[a-zA-Z0-9!@#$%^&*()_\-+={}\[\]|\\:;"'<>/?,.~`]{8,32}$/,
    []
  );

  const userLoginMutation = useUserLoginMutation();
  // 处理错误
  useEffect(() => {
    if (userLoginMutation.error && !state.userLoginRspIsHandled) {
      const errorInfo = handleAxiosError(userLoginMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          userLoginRspIsHandled: true,
        });
      } else if (errorInfo.code === 1 && errorInfo.cause === "password") {
        passwordInputRef.current!.focus();
        setState({
          ...state,
          passwordIsError: true,
          passwordErrorMessage: errorInfo.content,
          userLoginRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          userLoginRspIsHandled: true,
        });
        setVerifyImageState((s) => {
          return {
            ...s,
            isOpen: true,
          };
        });
      } else {
        setState({
          ...state,
          userLoginRspIsHandled: true,
        });
        sendSnackbar(
          "登录账号失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, state, userLoginMutation.error]);
  // 处理响应
  useEffect(() => {
    if (userLoginMutation.data && !state.userLoginRspIsHandled) {
      setState({
        ...state,
        userLoginRspIsHandled: true,
      });
      const data = userLoginMutation.data.data;
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      dispatch(setUserId(data.user_id));
    }
  }, [dispatch, state, userLoginMutation.data]);

  const loginButtonClick = useCallback(() => {
    if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (state.passwordIsError) {
      passwordInputRef.current!.focus();
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else if (!passwordRegexp.test(passwordInputRef.current!.value)) {
      passwordInputRef.current!.focus();
      setState({
        ...state,
        passwordIsError: true,
        passwordErrorMessage: "只能包含字母，数字与特殊字符，长度8-32位",
      });
    } else {
      setState({
        ...state,
        userLoginRspIsHandled: false,
      });
      userLoginMutation.mutate({
        email: emailInputRef.current!.value,
        password: passwordInputRef.current!.value,
      });
    }
  }, [emailRegexp, passwordRegexp, state, userLoginMutation]);

  // 如果用户已登录，重定向到之前页面
  useEffect(() => {
    if (userId) {
      navigate(-1);
    }
  }, [userId, navigate]);
  // 给回车键添加事件处理
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        loginButtonClick();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [loginButtonClick]);

  return (
    <BasePage>
      <Box sx={{ flexGrow: 1 }} />
      <Container
        sx={{
          maxWidth: (t) => t.breakpoints.values.large,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: {
            default: "0 32px",
            large: "0 64px",
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            alignSelf: "center",
            marginBottom: "40px",
            fontWeight: 400,
            fontSize: "2.8rem",
            letterSpacing: "0.1rem",
          }}
        >
          登录
        </Typography>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
          variant="outlined"
          error={state.emailIsError}
        >
          <InputLabel>电子邮箱</InputLabel>
          <OutlinedInput
            autoFocus
            inputRef={emailInputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.emailIsError === true &&
                emailRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  emailIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!emailRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  emailIsError: true,
                  emailErrorMessage: "邮箱地址格式不正确",
                });
              }
            }}
            label="电子邮箱"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.emailIsError ? "visible" : "hidden",
            }}
          >
            {state.emailErrorMessage}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "4px" }}
          variant="outlined"
          error={state.passwordIsError}
        >
          <InputLabel>密码</InputLabel>
          <OutlinedInput
            inputRef={passwordInputRef}
            type={state.passwordIsShow ? "text" : "password"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.passwordIsError === true &&
                passwordRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  passwordIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!passwordRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  passwordIsError: true,
                  passwordErrorMessage:
                    "只能包含字母，数字与特殊字符，长度8-32位",
                });
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setState({
                      ...state,
                      passwordIsShow: !state.passwordIsShow,
                    })
                  }
                  onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
                    event.preventDefault()
                  }
                  edge="end"
                >
                  {state.passwordIsShow ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="密码"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.passwordIsError ? "visible" : "hidden",
            }}
          >
            {state.passwordErrorMessage}
          </FormHelperText>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              margin: "4px 0 0 0",
              color: blue[400],
              userSelect: "none",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            onClick={() =>
              navigate("/forget", {
                replace: true,
              })
            }
          >
            忘记密码?
          </Typography>
          <Typography
            sx={{
              margin: "4px 0",
              color: blue[400],
              userSelect: "none",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            onClick={() =>
              navigate("/register", {
                replace: true,
              })
            }
          >
            注册账号
          </Typography>
        </Box>
        <LoadingButton
          ref={loginButtonRef}
          variant="contained"
          size="large"
          sx={{
            width: "50%",
            minWidth: "16ch",
            alignSelf: "center",
            fontSize: "1.1rem",
          }}
          loading={userLoginMutation.isLoading}
          onClick={loginButtonClick}
        >
          登录
        </LoadingButton>
        <VerifyImagePopper
          anchorEl={loginButtonRef.current}
          isOpen={verifyImageState.isOpen}
          needFetch={verifyImageState.needFetch}
          endpoint="/user/login"
          closeFn={() =>
            setVerifyImageState({
              ...verifyImageState,
              isOpen: false,
              needFetch: false,
            })
          }
          fetchCompleteFn={() =>
            setVerifyImageState({
              ...verifyImageState,
              needFetch: false,
            })
          }
          verifyCompleteFn={() =>
            setVerifyImageState({
              ...verifyImageState,
              isOpen: false,
              needFetch: true,
            })
          }
        />
      </Container>
      <Box sx={{ flexGrow: 1 }} />
      <NavigateButtonGroup
        canBack={true}
        backValue="返回"
        backOnClick={() => navigate(-1)}
      />
    </BasePage>
  );
};

export default LoginPage;
