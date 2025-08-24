export interface Customer {
  _id: string;
  nidNumber: string;
  name: string;
  mobile: string;
  birthDate: string;
  address: string;
  nidUploaded: boolean;
  nidFile?: string;
  registrationDate: string;
}

export interface CustomerFormData {
  nidNumber: string;
  name: string;
  mobile: string;
  birthDate: string;
  address: string;
}