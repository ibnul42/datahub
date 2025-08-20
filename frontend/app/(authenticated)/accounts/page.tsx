"use client";

import { useState } from "react";

interface CustomerRecord {
  accountNumber: string;
  status: string;
  accountStatus: string;
  documentsProgress: string;
  date: string;
}

export default function AccountsPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountStatus, setAccountStatus] = useState("Active");
  const [recentRecords, setRecentRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", accountNumber);
    // Implement API call
  };

  const handleClearForm = () => {
    setAccountNumber("");
    setAccountStatus("Active");
  };

  const handleSaveRecord = () => {
    console.log("Saving record...");
    // API call to save
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          👤 Customer Record Management
        </h2>
        <p className="text-gray-600">
          Manage customer records and account status
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔍 Search Customer Record
        </h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number (17 digits)
            </label>
            <input
              type="text"
              maxLength={17}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
              placeholder="Enter 17-digit account number"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Form */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            📝 Customer Record Form
          </h3>
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  maxLength={17}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono bg-blue-50"
                  placeholder="Enter 17-digit account number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be exactly 17 digits
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status *
                </label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleClearForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              onClick={handleSaveRecord}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              💾 Save Record
            </button>
          </div>
        </div>

        {/* Document Upload & Recent Records */}
        <div>
          {/* Document Upload */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              📄 Customer Documents
            </h3>
            {/* TODO: Implement Upload UI */}
            <p className="text-gray-500">Upload sections coming soon...</p>
          </div>

          {/* Recent Records */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Records
            </h3>
            <div className="space-y-3">
              {recentRecords.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent records</p>
              ) : (
                recentRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {record.accountNumber}
                      </p>
                      <p className="text-xs text-gray-600">
                        {record.documentsProgress}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Complete
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Customer Records
          </h3>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            📥 Download All Records
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Account Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Account Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Documents Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Records go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
