import { useMemo, FC } from "react";
import { useLocation } from "react-router-dom";
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepIconProps,
  Box,
  StepConnector,
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";

const steps = ["配置", "确认", "安装", "完成"];

const QontoConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 11,
    left: "calc(-50% + 12px)",
    right: "calc(50% + 12px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: green[500],
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: green[500],
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#0f4982",
    borderTopWidth: "3px",
  },
}));

const StepIcon: FC<StepIconProps> = ({ active, completed }) => {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: active || completed ? green[500] : "#0f4982",
      }}
    />
  );
};

const Stepper: FC = () => {
  const location = useLocation();

  const [show, activeStep] = useMemo(() => {
    const page = location.pathname.split("/", 2)[1];
    if (page === "config") {
      return [true, 0];
    } else if (page === "confirm") {
      return [true, 1];
    } else if (page === "install") {
      return [true, 2];
    } else if (page === "done") {
      return [true, 3];
    } else {
      return [false, 0];
    }
  }, [location.pathname]);

  if (show === true) {
    return (
      <MuiStepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
        sx={{
          width: "600px",
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={StepIcon}
              sx={{
                "& .MuiStepLabel-alternativeLabel.MuiStepLabel-label": {
                  marginTop: "2px",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
    );
  } else {
    return null;
  }
};

export default Stepper;
