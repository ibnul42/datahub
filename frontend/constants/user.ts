export interface User {
  _id: string;
  employeeId: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  password?: string;
}

export const roles = [
  "In-Charge",
  "Assistance In-Charge",
  "Cash In-charge",
  "Senior Desk Officer(SDO)",
  "Desk Officer(DO)",
  "Marketing Office(MO)",
  "Sales Office(SR)",
  "admin",
];

export const manageRoles = [
  "In-Charge",
  "Assistance In-Charge",
  "Cash In-charge",
  "Senior Desk Officer(SDO)",
  "Desk Officer(DO)",
  "admin",
];

export const customerCrud = [
  "In-Charge",
  "Assistance In-Charge",
  "Cash In-charge",
  "Senior Desk Officer(SDO)",
  "Desk Officer(DO)",
  "admin",
];

export const adminRoles = ["admin"];
