import api from './api';
import { Customer, CustomerFormData } from '@/components/customers/types';

export const customerService = {
  // Get all customers
  getCustomers: async (): Promise<{ data: Customer[] }> => {
    const response = await api.get('/customers');
    return response.data;
  },

  // Get customer by NID
  getCustomerByNID: async (nidNumber: string): Promise<{ data: Customer }> => {
    const response = await api.get(`/customers/nid/${nidNumber}`);
    return response.data;
  },

  // Create customer
  createCustomer: async (customerData: CustomerFormData): Promise<{ data: Customer }> => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Partial<CustomerFormData>): Promise<{ data: Customer }> => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Upload NID
  uploadNID: async (id: string, file: File): Promise<{ data: Customer }> => {
    const formData = new FormData();
    formData.append('nid', file);
    
    const response = await api.post(`/customers/${id}/upload-nid`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload Photo
  uploadPhoto: async (id: string, file: File): Promise<{ data: Customer }> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await api.post(`/customers/${id}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};