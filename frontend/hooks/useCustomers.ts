import { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from '@/components/customers/types';
import { customerService } from '@/services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers();
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CustomerFormData) => {
    try {
      setError(null);
      const response = await customerService.createCustomer(customerData);
      setCustomers(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<CustomerFormData>) => {
    try {
      setError(null);
      const response = await customerService.updateCustomer(id, customerData);
      setCustomers(prev => prev.map(cust => 
        cust._id === id ? response.data : cust
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setError(null);
      await customerService.deleteCustomer(id);
      setCustomers(prev => prev.filter(cust => cust._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete customer');
      throw err;
    }
  };

  const uploadNID = async (id: string, file: File) => {
    try {
      setError(null);
      const response = await customerService.uploadNID(id, file);
      setCustomers(prev => prev.map(cust => 
        cust._id === id ? response.data : cust
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload NID');
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    uploadNID,
  };
};