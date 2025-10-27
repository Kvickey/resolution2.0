export const AxisHeadersForAward = [
  {
    name: "SR_NO",
    validations: [
      { type: "notEmpty", message: "SR_NO cannot be empty" },
    //   { type: "number", message: "SR_NO must a number" },
    ],
  },
  {
    name: "REFERENCE_NO",
    validations: [
      { type: "notEmpty", message: "REFERENCE_NO cannot be empty" },
      { type: "combOnly", message: "REFERENCE_NO cannot be empty" },
    ],
  },
  {
    name: "Exparty",
    validations: [
      { type: "notEmpty", message: "Exparty cannot be empty" },
      // { type: "number", message: "Exparty must be an integer" },
    ],
  },
  {
    name: "Evidence",
    validations: [
      { type: "notEmpty", message: "Evidence cannot be empty" },
    ],
  },
  {
    name: "Argument",
    validations: [
      { type: "notEmpty", message: "Argument cannot be empty" },
      { type: "textOnly", message: "Argument must be an text only" },
    ],
  },
  {
    name: "Award_full_date",
    validations: [
      { type: "notEmpty", message: "Award_full_date cannot be empty" },
    ],
  },
  {
    name: "1st_Hearing_Traking_report",
    validations: [
      { type: "notEmpty", message: "1st_Hearing_Traking_report cannot be empty" },
      // { type: "number", message: "Mobile_no1 must be an integer" },
    ],
  },
  {
    name: "2nd_Hearing_Traking_report",
    validations: [
      { type: "notEmpty", message: "2nd_Hearing_Traking_report cannot be empty" },
    ],
  },
  {
    name: "3rd_Hearing_Traking_report",
    validations: [
      { type: "notEmpty", message: "3rd_Hearing_Traking_report cannot be empty" },
    ],
  },
]