import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import PropTypes from 'prop-types'; // Optional: for type checking

export default function CustomStepper({ steps = [], activeStep = 0 ,color = '#1abc9c'}) {
  // Ensure steps is always an array to avoid errors
  if (!Array.isArray(steps)) {
    console.error('The "steps" prop should be an array.');
    return null; // Render nothing if steps is not an array
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                    '& .MuiStepIcon-root.Mui-completed': {
                  color: color, // Keep the completed step icon in the color
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

// Optional: PropTypes for better type checking
CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number,
};
