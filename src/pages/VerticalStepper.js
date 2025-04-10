import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { Button } from 'react-bootstrap';

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Box>
              <Typography>Arbitrator Assigned</Typography>
              <Typography color="textSecondary">11/01/2024</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Appointment Letter</Typography>
              <Typography color="textSecondary">11/01/2024</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Acceptance Letter</Typography>
              <Typography color="textSecondary">11/01/2024</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>SOC</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Sec 17 Application</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Sec 17 Order / First Hearing</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Second Hearing</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Final Hearing</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Pursis</Typography>
            </Box>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Box>
              <Typography>Award</Typography>
            </Box>
          </StepLabel>
        </Step>
      </Stepper>
    </Box>
  );
};

export default VerticalStepper;




// import React from 'react';
// import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
// import { Button } from 'react-bootstrap';

// const steps = [
//   { label: 'Arbitrator Assigned', date: "11/01/2024" },
//   { label: 'Appointment Letter', date: "11/01/2024" },
//   { label: 'Acceptance Letter', date: "11/01/2024" },
//   { label: 'SOC' },
//   { label: 'Sec 17 Application' },
//   { label: 'Sec 17 Order / First Hearing' },
//   { label: 'Second Hearing' },
//   { label: 'Final Hearing' },
//   { label: 'Pursis' },
//   { label: 'Award' },
// ];

// const VerticalStepper = () => {
//   const [activeStep, setActiveStep] = React.useState(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   return (
//     <Box sx={{ maxWidth: 400 }}>
//       <Stepper activeStep={activeStep} orientation="vertical">
//         {steps.map((step, index) => (
//           <Step key={step.label}>
//             <StepLabel>
//               {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}> */}
//               <Box >
//                 <Typography>{step.label}</Typography>
//                 {step.date && <Typography color="textSecondary">{step.date}</Typography>}
//               </Box>
//             </StepLabel>
//           </Step>
//         ))}
//       </Stepper>
      
//     </Box>
//   );
// };

// export default VerticalStepper;
