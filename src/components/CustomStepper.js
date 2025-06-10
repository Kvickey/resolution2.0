import React from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import PropTypes from "prop-types";

export default function CustomStepper({
  steps = [],
  activeStep = 0,
  color = "#1abc9c",
}) {
  if (!Array.isArray(steps)) {
    console.error('The "steps" prop should be an array.');
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStep-root": {
            px: 1,
          },
          "& .MuiStepLabel-root": {
            flexDirection: "column",
            alignItems: "center",
          },
          "& .MuiStepConnector-root": {
            top: "9px", // aligns line with icon center
          },
          "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
            marginTop: "5px !important", // <== override the default 16px
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                "& .MuiStepIcon-root": {
                  fontSize: "1.1rem", // smaller icon
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: color,
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: color,
                },
                "& .MuiStepLabel-labelContainer": {
                  marginTop: "0px", // reduce space between icon and label
                },
                "& .MuiStepLabel-label": {
                  fontSize: "0.6rem",
                  // lineHeight: 1,
                  // marginTop: '1px', // fine-tune label spacing
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number,
  color: PropTypes.string,
};
