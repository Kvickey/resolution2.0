export const kotakccheaders = [
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
      validations: [{ type: "notEmpty", message: "Communication_address cannot be empty" }],
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
      name: "Card_no",
      validations: [
        { type: "notEmpty", message: "Card Number cannot be empty" },
      ],
    },
    {
      name: "Concate",
      validations: [
        { type: "notEmpty", message: "Concate cannot be empty" },
      ],
    },
    {
      name: "Region",
      validations: [
        { type: "notEmpty", message: "Region cannot be empty" },
      ],
    },
    {
      name: "State",
      validations: [
        { type: "notEmpty", message: "State cannot be empty" },
      ],
    },
    {
      name: "NRR",
      validations: [
        { type: "notEmpty", message: "NRR cannot be empty" },
      ],
    },
    {
      name: "CRN",
      validations: [
        { type: "notEmpty", message: "CRN cannot be empty" },
      ],
    },
    {
      name: "Credit_Limit",
      validations: [
        { type: "notEmpty", message: "Credit Limit cannot be empty" },
      ],
    },
    {
      name: "LRN_date",
      validations: [
        { type: "notEmpty", message: "LRN Date cannot be empty" },
      ],
    },
    {
      name: "LRN_amt",
      validations: [
        { type: "notEmpty", message: "LRN Amount cannot be empty" },
      ],
    },
    {
      name: "LRN_Amt_roundup",
      validations: [
        { type: "notEmpty", message: "LRN Roundup Amount cannot be empty" },
      ],
    },
    {
      name: "LRN_amt_in_rupees",
      validations: [
        { type: "notEmpty", message: "LRN Amount In Rupees cannot be empty" },
      ],
    },
    {
      name: "Current_bal",
      validations: [
        { type: "notEmpty", message: "Current Balance cannot be empty" },
      ],
    },
    {
      name: "Current_bal_roundup",
      validations: [
        { type: "notEmpty", message: "Roundup Current Balance cannot be empty" },
      ],
    },
    {
      name: "Current_bal_in_rupeess",
      validations: [
        { type: "notEmpty", message: "Current Balance In Rupees cannot be empty" },
      ],
    },
    {
      name: "Bal_date",
      validations: [
        { type: "notEmpty", message: "Balance Date cannot be empty" },
      ],
    },
    {
      name: "MAD",
      validations: [
        { type: "notEmpty", message: "MAV cannot be empty" },
      ],
    },
    {
      name: "Promo",
      validations: [
        { type: "notEmpty", message: "Promo cannot be empty" },
      ],
    },
    {
      name: "CM_name",
      validations: [
        { type: "notEmpty", message: "CM name cannot be empty" },
      ],
    },
    {
      name: "CM_Contact",
      validations: [
        { type: "notEmpty", message: "CM contact cannot be empty" },
      ],
    },
  ];
  