"use client";

import { Customer } from "./types";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  actionOption: boolean;
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
  loading = false,
  actionOption = false,
}: CustomerTableProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📝 Recent Customers
        </h3>
        <div className="text-center py-8 border border-gray-200 rounded-md">
          <div className="text-gray-500 text-lg">Loading customers...</div>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📝 Recent Customers
        </h3>
        <div className="text-center py-8 border border-gray-200 rounded-md">
          <div className="text-gray-500 text-lg mb-2">No customers found</div>
          {actionOption && (
            <p className="text-gray-400">
              Start by adding your first customer using the &quot;New Customer&quot;
              button
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        📝 Recent Customers
      </h3>
      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">NID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Mobile</th>
            <th className="px-4 py-2 border">NID Status</th>
            {actionOption && <th className="px-4 py-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{cust.nidNumber}</td>
              <td className="px-4 py-2 border">{cust.name}</td>
              <td className="px-4 py-2 border">{cust.mobile}</td>
              <td className="px-4 py-2 border">
                {cust.nidUploaded ? "✅ Verified" : "⏳ Pending"}
              </td>
              {actionOption && (
                <td className="px-4 py-2 border flex space-x-2">
                  <button
                    onClick={() => onEdit(cust)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(cust._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
