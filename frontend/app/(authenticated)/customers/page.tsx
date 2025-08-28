"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer, CustomerFormData } from "@/components/customers/types";
import CustomerModal from "@/components/customers/CustomerModal";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerSearch from "@/components/customers/CustomerSearch";
import { useAuthContext } from "@/context/AuthContext";
import { customerCrud } from "@/constants/user";

export default function RemittanceCustomerPage() {
  const {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    uploadNID,
    uploadPhoto,
  } = useCustomers();
  const { user } = useAuthContext();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const crudAccess = Boolean(user?.role && customerCrud.includes(user.role));

  const openModal = (customer?: Customer) => {
    console.log(customer);
    setSelectedCustomer(customer || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  // Update the onSubmit function to accept photoFile
  // page.tsx
  const handleSubmit = async (
    data: CustomerFormData,
    nidFile?: File | null,
    photoFile?: File | null
  ) => {
    setModalLoading(true);
    try {
      if (selectedCustomer) {
        // Update existing customer
        await updateCustomer(selectedCustomer._id, data);
        if (nidFile) {
          await uploadNID(selectedCustomer._id, nidFile);
        }
        if (photoFile) {
          await uploadPhoto(selectedCustomer._id, photoFile);
        }
      } else {
        // Create new customer
        const newCustomer = await createCustomer(data);
        if (nidFile) {
          await uploadNID(newCustomer._id, nidFile);
        }
        if (photoFile) {
          await uploadPhoto(newCustomer._id, photoFile);
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
    } catch (error) {
      alert("Failed to delete customer");
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    openModal(customer);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            💰 Remittance Customer Management
          </h2>
          <p className="text-gray-600">Manage remittance customer records</p>
        </div>
        {crudAccess && (
          <button
            onClick={() => openModal()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            ➕ New Customer
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <CustomerSearch
        customers={customers}
        onSelectCustomer={handleSelectCustomer}
      />

      {loading ? (
        <div className="text-center py-8">Loading customers...</div>
      ) : (
        <CustomerTable
          customers={customers}
          actionOption={crudAccess}
          onEdit={openModal}
          onDelete={handleDelete}
        />
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        customer={selectedCustomer}
        onSubmit={handleSubmit}
        loading={modalLoading}
        baseUrl={
          process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
          "http://localhost:5000"
        }
      />
    </div>
  );
}
