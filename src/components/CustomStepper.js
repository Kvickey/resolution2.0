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
                // '& .MuiStepIcon-root.Mui-completed': {
                //   color: '#1abc9c', // Set green color for completed step icon
                // },
                // '& .MuiStepIcon-root.Mui-active': {
                //   color: '#1abc9c', // Set green color for active step icon
                // },
                // '& .MuiStepLabel-label': {
                //   fontWeight: 'bold', // Make label bold
                //   color: activeStep === index || index < activeStep ? '#1abc9c' : undefined, // Set green color for the active/completed label
                // },
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
      {/* Uncomment if you want to display the current step message
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography>
          {activeStep === steps.length
            ? 'All steps completed - you\'re finished'
            : `Current Step: ${steps[activeStep]}`}
        </Typography>
      </Box>
      */}
    </Box>
  );
}

// Optional: PropTypes for better type checking
CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number,
};
