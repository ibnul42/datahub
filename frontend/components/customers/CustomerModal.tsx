"use client";

import { useState, useEffect } from "react";
import { Customer, CustomerFormData } from "./types";
import { useAuthContext } from "@/context/AuthContext";
import { customerCrud } from "@/constants/user";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSubmit: (
    data: CustomerFormData,
    nidFile?: File | null,
    photoFile?: File | null
  ) => Promise<void>;
  loading?: boolean;
  baseUrl?: string;
}

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
  onSubmit,
  loading = false,
  baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000",
}: CustomerModalProps) {
  const { user } = useAuthContext();
  const crudAccess = Boolean(user?.role && customerCrud.includes(user.role));
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    nidNumber: "",
    name: "",
    mobile: "",
    birthDate: "",
    address: "",
  });

  // Reset form data when customer prop changes
  useEffect(() => {
    if (customer) {
      setFormData({
        nidNumber: customer.nidNumber || "",
        name: customer.name || "",
        mobile: customer.mobile || "",
        birthDate: customer.birthDate
          ? new Date(customer.birthDate).toISOString().split("T")[0]
          : "",
        address: customer.address || "",
      });
      setNidFile(null);
      setPhotoFile(null);
      setPhotoPreview(null);
    } else {
      // Reset form for new customer
      setFormData({
        nidNumber: "",
        name: "",
        mobile: "",
        birthDate: "",
        address: "",
      });
      setNidFile(null);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [customer, isOpen]);

  // Generate photo URL for existing customer
  const customerPhotoUrl = customer?.photo
    ? `${baseUrl}/uploads/photos/${customer.photo}`
    : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace("customer-", "")]: value }));
  };

  const handleNidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNidFile(e.target.files[0]);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData, nidFile, photoFile);
      onClose();
    } catch (error) {
      // Error handled in parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold mb-6">
          {customer ? "Update Customer" : "Add New Customer"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Customer photo preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              ) : customerPhotoUrl ? (
                <img
                  src={customerPhotoUrl}
                  alt="Customer photo"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => {
                    // If the image fails to load, show placeholder
                    console.error("Image failed to load:", customerPhotoUrl);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <span className="text-gray-500 text-2xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors inline-block">
                📸 Upload Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                />
              </label>
              {photoFile && (
                <span className="ml-3 text-sm text-gray-600">
                  {photoFile.name}
                </span>
              )}
              {customer?.photoUploaded && !photoFile && (
                <span className="ml-3 text-sm text-green-600">
                  ✅ Photo uploaded
                </span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NID Number */}
            <div>
              <label
                htmlFor="customer-nidNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NID Number *
              </label>
              <input
                type="text"
                id="customer-nidNumber"
                placeholder="Enter NID number"
                value={formData.nidNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="customer-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="customer-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="customer-mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number *
              </label>
              <input
                type="text"
                id="customer-mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label
                htmlFor="customer-birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Birth Date *
              </label>
              <input
                type="date"
                id="customer-birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="customer-address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address *
              </label>
              <textarea
                id="customer-address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* NID Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NID Document
            </label>
            <div className="flex items-center space-x-4">
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors inline-block">
                📄 Upload NID (Image/PDF)
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleNidFileChange}
                />
              </label>
              {nidFile && (
                <span className="text-sm text-gray-600">{nidFile.name}</span>
              )}
              {customer?.nidUploaded && !nidFile && (
                <span className="text-sm text-green-600">
                  ✅ NID document uploaded
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {crudAccess && (
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
              >
                {loading
                  ? "Saving..."
                  : customer
                  ? "Update Customer"
                  : "Save Customer"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
