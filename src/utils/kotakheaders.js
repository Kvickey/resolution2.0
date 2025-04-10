export const kotakheaders = [
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
    validations: [{ type: "notEmpty", message: "CUST_ID cannot be empty" }],
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
    validations: [{ type: "notEmpty", message: "E_MAIL_ID cannot be empty" }],
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
    name: "LRN_Issue_Date",
    validations: [
      { type: "notEmpty", message: "LRN Issue Date cannot be empty" },
    ],
  },
  // {
  //   name: "Loan Sr no",
  //   validations: [
  //     { type: "number", message: "Loan Sr no cannot be empty" },
  //   ],
  // },
  {
    name: "Loan_Acc_No",
    validations: [
      { type: "combOnly", message: "Loan Acc No cannot be empty" },
    ],
  },
  {
    name: "Product",
    validations: [
      { type: "notEmpty", message: "PRODUCT cannot be empty" },
      { type: "textOnly", message: "CUST_NAME must be an text only" },
    ],
  },
  {
    name: "Aggrement_Date",
    validations: [
      { type: "notEmpty", message: "Aggrement Date cannot be empty" },
    ],
  },
  {
    name: "Aggrement_Value",
    validations: [
      { type: "notEmpty", message: "Aggrement Value cannot be empty" },
      { type: "number", message: "Aggrement Value must be an integer" },
    ],
  },
  {
    name: "Total_Aggrement_Value",
    validations: [
      { type: "notEmpty", message: "Total Aggrement Value cannot be empty" },
      { type: "number", message: "Total Aggrement Value must be an integer" },
    ],
  },
  {
    name: "Download_date",
    validations: [
      { type: "notEmpty", message: "Download date cannot be empty" },
    ],
  },
  {
    name: "FR_Amount",
    validations: [
      { type: "notEmpty", message: "FR Amount cannot be empty" },
      { type: "number", message: "Total Aggrement Value must be an integer" },
    ],
  },
  {
    name: "Total_Outstanding_Amount",
    validations: [
      { type: "notEmpty", message: "Total Outstanding Amount cannot be empty" },
      { type: "number", message: "Total Aggrement Value must be an integer" },
    ],
  },
  {
    name: "COLLECTION_MANAGER_NAME",
    validations: [
      { type: "notEmpty", message: "COLLECTION MANAGER NAME cannot be empty" },
      { type: "textOnly", message: "COLLECTION MANAGER NAME must be textOnly " },
    ],
  },
  {
    name: "Collection_Manager_Email_Id",
    // validations: [
    //   { type: "notEmpty", message: "Collection Manager Email Id cannot be empty" },
    //   { type: "combOnly", message: "Collection Manager Email Id must be textOnly " },
    // ],
  },
  {
    name: "COLLECTION_MANAGER_NO",
    // validations: [
    //   { type: "notEmpty", message: "Collection Manager Email Id cannot be empty" },
    //   { type: "combOnly", message: "Collection Manager Email Id must be textOnly " },
    // ],
  },
];
