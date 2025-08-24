"use client";

import { useState } from "react";
import { Customer, CustomerFormData } from "./types";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData, file?: File | null) => Promise<void>;
  loading?: boolean;
}

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
  onSubmit,
  loading = false,
}: CustomerModalProps) {
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    nidNumber: customer?.nidNumber || "",
    name: customer?.name || "",
    mobile: customer?.mobile || "",
    birthDate: customer?.birthDate
      ? new Date(customer.birthDate).toISOString().split("T")[0]
      : "",
    address: customer?.address || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace("customer-", "")]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNidFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData, nidFile);
      onClose();
    } catch (error) {
      // Error handled in parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold mb-4">
          {customer ? "Update Customer" : "Add New Customer"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              id="customer-nidNumber"
              placeholder="NID Number"
              value={formData.nidNumber}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
            />
            <input
              type="text"
              id="customer-name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
            />
            <input
              type="text"
              id="customer-mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
            />
            <input
              type="date"
              id="customer-birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700"
            />
            <textarea
              id="customer-address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 md:col-span-2"
            />
          </div>

          {/* NID Upload */}
          <div className="mt-4">
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-sm cursor-pointer transition-colors inline-block">
              📤 Upload NID
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </label>
            {nidFile && <span className="ml-2">{nidFile.name}</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md"
            >
              {loading
                ? "Saving..."
                : customer
                ? "Update Customer"
                : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
