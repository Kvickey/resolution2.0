export const headers = [
  {
    name: "SR_NO",
    validations: [
      { type: "notEmpty", message: "SR_NO cannot be empty" },
    //   { type: "number", message: "SR_NO must a number" },
    ],
  },
  {
    name: "Lot_No",
    validations: [{ type: "notEmpty", message: "Lot_No cannot be empty" }],
  },
  {
    name: "ACC_NO",
    validations: [{ type: "notEmpty", message: "ACC_NO cannot be empty" }],
  },
  {
    name: "REFERENCE_NO",
    validations: [
      { type: "notEmpty", message: "REFERENCE_NO cannot be empty" },
      { type: "combOnly", message: "REFERENCE_NO cannot be empty" },
    ],
  },
  {
    name: "CUST_ID",
    validations: [
      { type: "notEmpty", message: "CUST_ID cannot be empty" },
      { type: "number", message: "CUST_ID must be an integer" },
    ],
  },
  {
    name: "Type",
    validations: [
      { type: "notEmpty", message: "CUST_ID cannot be empty" },
    ],
  },
  {
    name: "CUST_NAME",
    validations: [
      { type: "notEmpty", message: "CUST_NAME cannot be empty" },
      { type: "textOnly", message: "CUST_NAME must be an text only" },
    ],
  },
  {
    name: "Mobile_no",
    validations: [
      { type: "notEmpty", message: "Mobile_no1 cannot be empty" },
      { type: "number", message: "Mobile_no1 must be an integer" },
    ],
  },
  {
    name: "WORK_MOBILE_2",
    validations: [
      // { type: "notEmpty", message: "Mobile_no1 cannot be empty" },
      // { type: "number", message: "Mobile_no1 must be an integer" },
    ],
  },
  {
    name: "E_MAIL_ID",
    validations: [
      { type: "notEmpty", message: "E_MAIL_ID cannot be empty" },
    ],
  },
  {
    name: "Communication_address",
  },
  {
    name: "And_Also_At_address1",
  },
  {
    name: "And_Also_At_address2",
  },
  {
    name: "And_Also_At_address3",
  },
  {
    name: "work_Address",
  },
  {
    name: "PRODUCT",
    validations: [{ type: "notEmpty", message: "PRODUCT cannot be empty" }],
  },
  {
    name: "REGISTRATION_NO",
    validations: [
      { type: "notEmpty", message: "REGISTRATION_NO cannot be empty" },
    ],
  },
  {
    name: "ENGINE_NUMBER",
    validations: [
      { type: "notEmpty", message: "ENGINE_NUMBER cannot be empty" },
    ],
  },
  {
    name: "CHASSIS_NUMBER",
    validations: [
      { type: "notEmpty", message: "CHASSIS_NUMBER cannot be empty" },
    ],
  },
  {
    name: "MODEL1",
    validations: [{ type: "notEmpty", message: "MODEL1 cannot be empty" }],
  },
  {
    name: "MODEL2",
  },
  {
    name: "MANUFACTURER",
    validations: [
      { type: "notEmpty", message: "MANUFACTURER cannot be empty" },
    ],
  },
  {
    name: "DEALER",
    validations: [{ type: "notEmpty", message: "DEALER cannot be empty" }],
  },
  {
    name: "INTEREST_RATE",
    validations: [
      { type: "notEmpty", message: "INTEREST_RATE cannot be empty" },
      { type: "number", message: "INTEREST_RATE must be an integer" },
    ],
  },
  {
    name: "DISBURSEMENT_AMOUNT",
    validations: [
      { type: "notEmpty", message: "DISBURSEMENT_AMOUNT cannot be empty" },
      { type: "number", message: "DISBURSEMENT_AMOUNT must be an integer" },
    ],
  },
  {
    name: "DISB_AMOUNT_IN_WORDS",
    validations: [
      { type: "notEmpty", message: "DISB_AMOUNT_IN_WORDS cannot be empty" },
      {
        type: "textOnly",
        message: "DISB_AMOUNT_IN_WORDS must be an text only",
      },
    ],
  },
  {
    name: "DISBURSEMENT_DATE",
    validations: [
      { type: "notEmpty", message: "DISBURSEMENT_DATE cannot be empty" },
    //   {
    //     type: "dateOnly",
    //     message: "DISBURSEMENT_DATE must be an date in dd-mm-yyyy format only",
    //   },
    ],
  },
  {
    name: "TENURE",
    validations: [
      { type: "notEmpty", message: "TENURE cannot be empty" },
      { type: "number", message: "TENURE must be an integer" },
    ],
  },
  {
    name: "EMI_AMT",
    validations: [
      { type: "notEmpty", message: "EMI_AMT cannot be empty" },
      { type: "number", message: "EMI_AMT must be an integer" },
    ],
  },
  {
    name: "EMI_START_DATE",
    validations: [
      { type: "notEmpty", message: "EMI_START_DATE cannot be empty" },
    //   {
    //     type: "dateOnly",
    //     message: "EMI_START_DATE must be an date in dd-mm-yyyy format only",
    //   },
    ],
  },
  {
    name: "FORCLOSER_AMT_ROUNDUP",
    validations: [
      { type: "notEmpty", message: "FORCLOSER_AMT_ROUNDUP cannot be empty" },
      { type: "number", message: "FORCLOSER_AMT_ROUNDUP must be an integer" },
    ],
  },
  {
    name: "FORCLOSER_AMT_IN_WORDS",
    validations: [
      { type: "notEmpty", message: "FORCLOSER_AMT_IN_WORDS cannot be empty" },
      {
        type: "textOnly",
        message: "FORCLOSER_AMT_IN_WORDS must be an text only",
      },
    ],
  },
  {
    name: "LOAN_START_DATE",
    validations: [
      { type: "notEmpty", message: "LOAN_START_DATE cannot be empty" },
    //   {
    //     type: "dateOnly",
    //     message: "LOAN_START_DATE must be an date in dd-mm-yyyy format only",
    //   },
    ],
  },
  {
    name: "LRN_REFERENCE_NO",
  },
  {
    name: "LRN_date",
    validations: [
      { type: "notEmpty", message: "LOAN_START_DATE cannot be empty" },
    //   {
    //     type: "dateOnly",
    //     message: "LOAN_START_DATE must be an date in dd-mm-yyyy format only",
    //   },
    ],
  },
  {
    name: "WORK_FINAL_CITY",
  },
  {
    name: "BRANCH_RAC_NAME",
    validations: [
      { type: "notEmpty", message: "BRANCH_RAC_NAME cannot be empty" },
      { type: "textOnly", message: "BRANCH_RAC_NAME must be an text only" },
    ],
  },
  {
    name: "FINAL_CITY",
  },
  {
    name: "STATE",
    validations: [
      { type: "notEmpty", message: "STATE cannot be empty" },
      { type: "textOnly", message: "STATE must be an text only" },
    ],
  },
]