import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Check from "@mui/icons-material/Check";
import { styled } from "@mui/system";

// Define the theme with success color
const theme = createTheme({
  palette: {
    success: {
      main: "#4caf50", // Define the main color for success (green)
    },
  },
});

// Custom styled StepLabel to place labels below the dots
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    marginTop: theme.spacing(1), // Adjust space for label
    textAlign: "center", // Center align the label text
  },
  "& .MuiStepConnector-line": {
    display: "none", // Hide the default connector line
  },
}));

// Custom styled StepIcon for larger circles
const CustomStepIcon = styled("div")(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40, // Increase the width of the circle
  height: 40, // Increase the height of the circle
  borderRadius: "50%",
  backgroundColor: ownerState.active ? theme.palette.success.main : "#e0e0e0", // Default color for inactive steps
  color: "#fff",
  border: ownerState.completed
    ? `2px solid ${theme.palette.success.main}`
    : "none",
  "& .MuiSvgIcon-root": {
    fontSize: 24, // Increase the size of the check icon
  },
}));

// Custom icon component to render circles and check icons
const StepIcon = (props) => {
  const { active, completed } = props;

  return (
    <CustomStepIcon ownerState={{ active, completed }}>
      {completed ? <Check /> : null}
    </CustomStepIcon>
  );
};

// Component to render each step with its date
const StepWithDate = ({ label, date }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <CustomStepLabel>{label}</CustomStepLabel>
    <Typography variant="caption" color="textSecondary">
      {date}
    </Typography>
  </Box>
);

const StepperComponent = ({ steps, activeStep, handleNext, handleBack, handleReset }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }} className="mt-5">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          StepIconComponent={StepIcon}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepWithDate label={step.label} date={step.date} />
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed
              </Typography>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }} className="d-none">
                Step {activeStep + 1}
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "row", pt: 2 }}
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  className="d-none"
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext} className="d-none">
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </div>
          )}
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default StepperComponent;
