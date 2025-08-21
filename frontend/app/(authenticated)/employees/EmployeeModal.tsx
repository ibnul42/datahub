import React from "react";

interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  nidNumber?: string;
  position: string;
  joiningDate?: string;
  salary?: string;
  status: string;
}

interface EmployeeModalProps {
  isEditing: boolean;
  formData: EmployeeFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  closeModal: () => void;
  handleSave: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isEditing,
  formData,
  handleChange,
  closeModal,
  handleSave,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex justify-center items-center overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Personal Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID *
                </label>
                <input
                  type="text"
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., EMP001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NID Number
                </label>
                <input
                  type="text"
                  id="nidNumber"
                  value={formData.nidNumber || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Job Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position *
                </label>
                <select
                  id="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Position</option>
                  <option value="In-charge">In-charge</option>
                  <option value="Assistant In-charge">Assistant In-charge</option>
                  <option value="Account's Office">Account&apos;s Office</option>
                  <option value="Senior Desk Officer">Senior Desk Officer</option>
                  <option value="Senior Cashier">Senior Cashier</option>
                  <option value="Senior Investment worker">Senior Investment worker</option>
                  <option value="Desk Officer">Desk Officer</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Investment Worker">Investment Worker</option>
                  <option value="Peon/Security Guard">Peon/Security Guard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  value={formData.joiningDate || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  value={formData.salary || ""}
                  onChange={handleChange}
                  placeholder="Monthly salary"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
