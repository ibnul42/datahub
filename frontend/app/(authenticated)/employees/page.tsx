"use client";

import { useEffect, useState } from "react";

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  position: string;
  status: "Active" | "Inactive";
  documents: number;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Employee | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployees([
        {
          id: 1,
          employeeId: "EMP001",
          name: "Alice Johnson",
          position: "Software Engineer",
          status: "Active",
          documents: 5,
        },
        {
          id: 2,
          employeeId: "EMP002",
          name: "Bob Smith",
          position: "HR Manager",
          status: "Inactive",
          documents: 3,
        },
        {
          id: 3,
          employeeId: "EMP003",
          name: "Charlie Davis",
          position: "Accountant",
          status: "Active",
          documents: 7,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = () => {
    const result = employees.find((emp) => emp.employeeId === searchId);
    setSearchResult(result || null);
  };

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            👨‍💼 Employee Records Management
          </h2>
          <p className="text-gray-600">
            Manage employee information and documents
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => alert("Show Add Employee Modal")}
        >
          ➕ Add Employee
        </button>
      </div>

      {/* Search Employee */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          🔍 Search Employee
        </h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
              placeholder="Enter Employee ID (e.g., EMP001)"
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

        {searchResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Search Result:
            </h4>
            <p>
              <strong>Name:</strong> {searchResult.name} |{" "}
              <strong>Position:</strong> {searchResult.position} |{" "}
              <strong>Status:</strong> {searchResult.status}
            </p>
          </div>
        )}

        {searchResult === null && searchId && (
          <p className="mt-4 text-red-500">No employee found.</p>
        )}
      </div>

      {/* Employee List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Employee Directory
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="p-6 text-gray-500">No employees found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
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
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.employeeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.position}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.documents}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => alert(`Edit employee ${emp.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => alert(`Delete employee ${emp.id}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
