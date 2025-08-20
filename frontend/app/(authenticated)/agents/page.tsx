'use client'
import React, { useState } from "react";

const Agents = () => {
  const [searchMobile, setSearchMobile] = useState("");
  const [agent, setAgent] = useState({
    mobile: "",
    type: "",
    name: "",
    nid: "",
    birthDate: "",
    status: "Active",
    address: "",
  });

  const [uploadStatus, setUploadStatus] = useState({
    nid: "⏳ Pending",
    photo: "⏳ Pending",
  });

  const handleClearForm = () => {
    setAgent({
      mobile: "",
      type: "",
      name: "",
      nid: "",
      birthDate: "",
      status: "Active",
      address: "",
    });
  };

  const handleSaveAgent = () => {
    // Implement save logic
    console.log("Saving Agent:", agent);
  };

  const handleUpload = (fileType) => {
    setUploadStatus((prev) => ({
      ...prev,
      [fileType]: "✅ Uploaded",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            📱 m-Cash Agent Record Management
          </h2>
          <p className="text-gray-600">Manage m-Cash agent records and documentation</p>
        </div>
        <button
          onClick={handleClearForm}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ➕ New Agent
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔍 Search Agent by Mobile Number
        </h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
              placeholder="Enter mobile number"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              📝 Agent Registration Form
            </h3>

            <div className="space-y-6">
              {/* Mobile & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={agent.mobile}
                    onChange={(e) => setAgent({ ...agent, mobile: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono bg-blue-50"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Type *
                  </label>
                  <select
                    value={agent.type}
                    onChange={(e) => setAgent({ ...agent, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Agent Type</option>
                    <option value="Super Agent">Super Agent</option>
                    <option value="Agent">Agent</option>
                    <option value="Sub Agent">Sub Agent</option>
                  </select>
                </div>
              </div>

              {/* Name & NID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NID Number *
                  </label>
                  <input
                    type="text"
                    value={agent.nid}
                    onChange={(e) => setAgent({ ...agent, nid: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter NID number"
                  />
                </div>
              </div>

              {/* DOB & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={agent.birthDate}
                    onChange={(e) => setAgent({ ...agent, birthDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={agent.status}
                    onChange={(e) => setAgent({ ...agent, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  value={agent.address}
                  onChange={(e) => setAgent({ ...agent, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleClearForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>
              <button
                onClick={handleSaveAgent}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                💾 Save Agent
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              📄 Document Upload
            </h3>

            {/* NID Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
              <span className="text-3xl mb-3 block">🆔</span>
              <h4 className="font-medium text-gray-900 mb-2">National ID Card</h4>
              <p className="text-sm text-gray-600 mb-4">Upload clear copy of NID</p>
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-sm cursor-pointer transition-colors inline-block">
                📤 Upload NID
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={() => handleUpload("nid")}
                />
              </label>
              {uploadStatus.nid === "✅ Uploaded" && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3 text-green-600 text-sm">
                  ✅ NID uploaded successfully
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
              <span className="text-3xl mb-3 block">📸</span>
              <h4 className="font-medium text-gray-900 mb-2">Agent Photo</h4>
              <p className="text-sm text-gray-600 mb-4">Upload agent photograph</p>
              <label className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md text-sm cursor-pointer transition-colors inline-block">
                📤 Upload Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={() => handleUpload("photo")}
                />
              </label>
              {uploadStatus.photo === "✅ Uploaded" && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3 text-green-600 text-sm">
                  ✅ Photo uploaded successfully
                </div>
              )}
            </div>

            {/* Upload Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Upload Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NID Document</span>
                  <span className="text-sm text-gray-400">{uploadStatus.nid}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Agent Photo</span>
                  <span className="text-sm text-gray-400">{uploadStatus.photo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Agents */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Agents
            </h3>
            <div className="space-y-3">
              {/* Populate dynamically */}
              <p className="text-gray-500 text-sm">No recent agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Agent Directory</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Populate dynamically */}
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No agents found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;
