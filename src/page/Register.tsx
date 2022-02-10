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
  Typography,
  Box,
  Container,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { blue } from "@mui/material/colors";
import { VisibilityOff, Visibility } from "@mui/icons-material";

import { useAppDispatch, useAppSelector, useSnackbar } from "@/hook";
import { useVerifyEmailMutation } from "@/api/email";
import { useUserRegisterMutation } from "@/api/user";
import { setAccessToken, setRefreshToken } from "@/util/localStorageHandler";
import { handleAxiosError } from "@/util/errorHandler";
import { setUserId } from "@/slice/userSlice";
import CountDownLoadingButton from "@/component/CountDownLoadingButton";
import VerifyImagePopper from "@/component/VerifyImagePopper";
import NavigateButtonGroup from "@/component/NavigateButtonGroup";
import BasePage from "./Base";

type BaseState = {
  nicknameIsError: boolean;
  emailIsError: boolean;
  emailErrorMessage: string;
  emailVerifyCodeIsError: boolean;
  emailVerifyCodeErrorMessage: string;
  passwordIsError: boolean;
  passwordErrorMessage: string;
  passwordIsShow: boolean;
  verifyEmailRspIsHandled: boolean;
  userRegisterRspIsHandled: boolean;
};
type VerifyImageState = {
  isOpen: boolean;
  needFetch: boolean;
};

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sendSnackbar = useSnackbar();
  const userId = useAppSelector((s) => s.user.userId);
  const [countDownIsRunning, setCountDownIsRunning] = useState(false);

  const [state, setState] = useState<BaseState>({
    nicknameIsError: false,
    emailIsError: false,
    emailErrorMessage: "默认错误",
    emailVerifyCodeIsError: false,
    emailVerifyCodeErrorMessage: "默认错误",
    passwordIsError: false,
    passwordErrorMessage: "默认错误",
    passwordIsShow: false,
    verifyEmailRspIsHandled: false,
    userRegisterRspIsHandled: false,
  });
  const [verifyImageState1, setVerifyImageState1] = useState<VerifyImageState>({
    isOpen: false,
    needFetch: true,
  });
  const [verifyImageState2, setVerifyImageState2] = useState<VerifyImageState>({
    isOpen: false,
    needFetch: true,
  });

  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailVerifyCodeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailVerifyButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);

  const nicknameRegexp = useMemo(() => /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,64}$/, []);
  const emailVerifyCodeRegexp = useMemo(() => /^[0-9]{4}$/, []);
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

  const verifyEmailMutation = useVerifyEmailMutation();
  // 处理错误
  useEffect(() => {
    if (verifyEmailMutation.error && !state.verifyEmailRspIsHandled) {
      const errorInfo = handleAxiosError(verifyEmailMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          verifyEmailRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          verifyEmailRspIsHandled: true,
        });
        setVerifyImageState1((s) => {
          return {
            ...s,
            isOpen: true,
          };
        });
      } else {
        setState({
          ...state,
          verifyEmailRspIsHandled: true,
        });
        sendSnackbar(
          "发送验证邮件失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, state, verifyEmailMutation.error]);
  // 处理响应
  useEffect(() => {
    if (verifyEmailMutation.data && !state.verifyEmailRspIsHandled) {
      setState({
        ...state,
        verifyEmailRspIsHandled: true,
      });
      setCountDownIsRunning(true);
      sendSnackbar(
        "验证邮件发送成功",
        "请查看您邮箱的收件箱或垃圾邮件箱",
        "success"
      );
    }
  }, [sendSnackbar, state, verifyEmailMutation.data]);

  const userRegisterMutation = useUserRegisterMutation();
  // 处理错误
  useEffect(() => {
    if (userRegisterMutation.error && !state.userRegisterRspIsHandled) {
      const errorInfo = handleAxiosError(userRegisterMutation.error);
      if (errorInfo.code === 1 && errorInfo.cause === "email") {
        emailInputRef.current!.focus();
        setState({
          ...state,
          emailIsError: true,
          emailErrorMessage: errorInfo.content,
          userRegisterRspIsHandled: true,
        });
      } else if (
        errorInfo.code === 1 &&
        errorInfo.cause === "verifyEmailCode"
      ) {
        emailVerifyCodeInputRef.current!.focus();
        setState({
          ...state,
          emailVerifyCodeIsError: true,
          emailVerifyCodeErrorMessage: errorInfo.content,
          userRegisterRspIsHandled: true,
        });
      } else if (errorInfo.code === 6) {
        setState({
          ...state,
          userRegisterRspIsHandled: true,
        });
        setVerifyImageState2((s) => {
          return {
            ...s,
            isOpen: true,
          };
        });
      } else {
        setState({
          ...state,
          userRegisterRspIsHandled: true,
        });
        sendSnackbar(
          "注册账号失败",
          errorInfo.content,
          errorInfo.isClientErorr ? "info" : "error"
        );
      }
    }
  }, [sendSnackbar, state, userRegisterMutation.error]);
  // 处理响应
  useEffect(() => {
    if (userRegisterMutation.data && !state.userRegisterRspIsHandled) {
      setState({
        ...state,
        userRegisterRspIsHandled: true,
      });
      const data = userRegisterMutation.data.data;
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      dispatch(setUserId(data.user_id));
    }
  }, [sendSnackbar, state, userRegisterMutation.data, dispatch]);

  const verifyEmailButtonClick = useCallback(() => {
    if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else {
      setState({
        ...state,
        verifyEmailRspIsHandled: false,
      });
      verifyEmailMutation.mutate({
        emailAddr: emailInputRef.current!.value,
        emailType: "register_user",
      });
    }
  }, [emailRegexp, state, verifyEmailMutation]);

  const userRegisterButtonClick = useCallback(() => {
    if (state.nicknameIsError) {
      nicknameInputRef.current!.focus();
    } else if (state.emailIsError) {
      emailInputRef.current!.focus();
    } else if (state.emailVerifyCodeIsError) {
      emailVerifyCodeInputRef.current!.focus();
    } else if (state.passwordIsError) {
      passwordInputRef.current!.focus();
    } else if (!nicknameRegexp.test(nicknameInputRef.current!.value)) {
      nicknameInputRef.current!.focus();
      setState({
        ...state,
        nicknameIsError: true,
      });
    } else if (!emailRegexp.test(emailInputRef.current!.value)) {
      emailInputRef.current!.focus();
      setState({
        ...state,
        emailIsError: true,
        emailErrorMessage: "邮箱地址格式不正确",
      });
    } else if (
      !emailVerifyCodeRegexp.test(emailVerifyCodeInputRef.current!.value)
    ) {
      emailVerifyCodeInputRef.current!.focus();
      setState({
        ...state,
        emailVerifyCodeIsError: true,
        emailVerifyCodeErrorMessage: "邮箱验证码格式不正确",
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
        userRegisterRspIsHandled: false,
      });
      userRegisterMutation.mutate({
        nickname: nicknameInputRef.current!.value,
        email: emailInputRef.current!.value,
        verifyCode: emailVerifyCodeInputRef.current!.value,
        password: passwordInputRef.current!.value,
      });
    }
  }, [
    nicknameRegexp,
    emailRegexp,
    passwordRegexp,
    emailVerifyCodeRegexp,
    state,
    userRegisterMutation,
  ]);

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
        userRegisterButtonClick();
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [userRegisterButtonClick]);

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
          注册
        </Typography>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
          variant="outlined"
          error={state.nicknameIsError}
        >
          <InputLabel>昵称</InputLabel>
          <OutlinedInput
            autoFocus
            inputRef={nicknameInputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.nicknameIsError === true &&
                nicknameRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  nicknameIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!nicknameRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  nicknameIsError: true,
                });
              }
            }}
            label="昵称"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.nicknameIsError ? "visible" : "hidden",
            }}
          >
            昵称只能包含中文，字母，数字，下划线
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
          variant="outlined"
          error={state.emailIsError}
        >
          <InputLabel>电子邮箱</InputLabel>
          <OutlinedInput
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
          sx={{ width: "100%", minWidth: "25ch", marginBottom: "12px" }}
          variant="outlined"
          error={state.emailVerifyCodeIsError}
        >
          <InputLabel>邮箱验证码</InputLabel>
          <OutlinedInput
            inputRef={emailVerifyCodeInputRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (
                state.emailVerifyCodeIsError === true &&
                emailVerifyCodeRegexp.test(event.target.value)
              ) {
                setState({
                  ...state,
                  emailVerifyCodeIsError: false,
                });
              }
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (!emailVerifyCodeRegexp.test(event.target.value)) {
                setState({
                  ...state,
                  emailVerifyCodeIsError: true,
                  emailVerifyCodeErrorMessage: "邮箱验证码格式不正确",
                });
              }
            }}
            sx={{
              padding: "0",
              "& .MuiInputAdornment-root": {
                height: "100%",
                maxHeight: "100%",
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <CountDownLoadingButton
                  ref={emailVerifyButtonRef}
                  variant="contained"
                  sx={{ width: "120px", height: "100%" }}
                  countDownSeconds={60}
                  countDownIsRunning={countDownIsRunning}
                  setCountDownStop={() => setCountDownIsRunning(false)}
                  loading={verifyEmailMutation.isLoading}
                  onClick={verifyEmailButtonClick}
                >
                  点此获取
                </CountDownLoadingButton>
              </InputAdornment>
            }
            label="邮箱验证码"
          />
          <FormHelperText
            error
            variant="outlined"
            sx={{
              marginTop: "0px",
              visibility: state.emailVerifyCodeIsError ? "visible" : "hidden",
            }}
          >
            {state.emailVerifyCodeErrorMessage}
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
            justifyContent: "end",
            flexDirection: "row",
            marginBottom: "16px",
          }}
        >
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
            onClick={() => navigate("/login", { replace: true })}
          >
            已有账号，直接登录{">"}
          </Typography>
        </Box>
        <LoadingButton
          ref={registerButtonRef}
          variant="contained"
          size="large"
          sx={{
            width: "50%",
            minWidth: "16ch",
            alignSelf: "center",
            fontSize: "1.1rem",
          }}
          loading={userRegisterMutation.isLoading}
          onClick={userRegisterButtonClick}
        >
          注册
        </LoadingButton>
        <VerifyImagePopper
          anchorEl={emailVerifyButtonRef.current}
          isOpen={verifyImageState1.isOpen}
          needFetch={verifyImageState1.needFetch}
          endpoint="/email/verify"
          closeFn={() =>
            setVerifyImageState1({
              ...verifyImageState1,
              isOpen: false,
              needFetch: false,
            })
          }
          fetchCompleteFn={() =>
            setVerifyImageState1({
              ...verifyImageState1,
              needFetch: false,
            })
          }
          verifyCompleteFn={() =>
            setVerifyImageState1({
              ...verifyImageState1,
              isOpen: false,
              needFetch: true,
            })
          }
        />
        <VerifyImagePopper
          anchorEl={registerButtonRef.current}
          isOpen={verifyImageState2.isOpen}
          needFetch={verifyImageState2.needFetch}
          endpoint="/user/register"
          closeFn={() =>
            setVerifyImageState2({
              ...verifyImageState2,
              isOpen: false,
              needFetch: false,
            })
          }
          fetchCompleteFn={() =>
            setVerifyImageState2({
              ...verifyImageState2,
              needFetch: false,
            })
          }
          verifyCompleteFn={() =>
            setVerifyImageState2({
              ...verifyImageState2,
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

export default RegisterPage;
