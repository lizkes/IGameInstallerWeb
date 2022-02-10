/* eslint-disable react/prop-types */
import { useEffect, useState, FC } from "react";
import { Button, ButtonProps } from "@mui/material";

type Props = ButtonProps & {
  countDownSeconds: number;
  countDownIsRunning: boolean;
  countDownStopFn: () => void;
  countDownText?: string;
};

const CountDownButton: FC<Props> = ({
  countDownSeconds,
  countDownIsRunning,
  countDownStopFn,
  countDownText,
  ...props
}) => {
  const [seconds, setSeconds] = useState(countDownSeconds);

  useEffect(() => {
    if (countDownIsRunning) {
      if (seconds === 0) {
        countDownStopFn();
        setSeconds(countDownSeconds);
      } else if (seconds > 0) {
        const timeoutId = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [seconds, countDownIsRunning, countDownSeconds, countDownStopFn]);

  return (
    <Button disabled={countDownIsRunning && seconds > 0} {...props}>
      {countDownIsRunning && seconds > 0
        ? `${countDownText} ${seconds}秒`
        : props.children}
    </Button>
  );
};

export default CountDownButton;
