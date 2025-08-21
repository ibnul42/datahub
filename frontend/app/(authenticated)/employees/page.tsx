"use client";

import { useEffect, useState } from "react";
import EmployeeModal from "./EmployeeModal";
import { useAuthContext } from "@/context/AuthContext";
import { adminRoles } from "@/constants/user";

type EmpStatus = "Active" | "Inactive" | "On Leave";

interface Employee {
  id: string; // MongoDB _id
  employeeId: string;
  name: string;
  email?: string;
  phone?: string;
  nidNumber?: string;
  position: string;
  joiningDate?: string; // ISO yyyy-mm-dd
  salary?: number | null;
  status: EmpStatus;
  documents: number;
}

interface EmployeeForm {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  nidNumber: string;
  position: string;
  joiningDate: string;
  salary: string;
  status: EmpStatus;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/employees`; // adjust if needed
const token = localStorage.getItem("token"); // or get it from context/auth

export default function Employees() {
  const { user } = useAuthContext();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Employee[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<EmployeeForm>({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    nidNumber: "",
    position: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  });

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_URL}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // const res = await fetch(API_URL);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to fetch employees");
          return;
        }
        setEmployees(data.data.map((emp: any) => ({ ...emp, id: emp._id })));
      } catch (err) {
        console.error("Server error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchId.trim() === "") {
      setSearchResult([]);
      return;
    }

    const results = employees.filter((emp) =>
      emp.employeeId.toLowerCase().includes(searchId.trim().toLowerCase())
    );
    setSearchResult(results);
  }, [searchId, employees]);

  // Search by Employee ID (client-side)
  const handleSearch = () => {
    const results = employees.filter((emp) =>
      emp.employeeId.toLowerCase().includes(searchId.trim().toLowerCase())
    );
    setSearchResult(results);
  };

  // Open modal for create
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      nidNumber: "",
      position: "",
      joiningDate: "",
      salary: "",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (emp: Employee) => {
    setIsEditing(true);
    setEditingId(emp.id);
    setFormData({
      employeeId: emp.employeeId ?? "",
      name: emp.name ?? "",
      email: emp.email ?? "",
      phone: emp.phone ?? "",
      nidNumber: emp.nidNumber ?? "",
      position: emp.position ?? "",
      joiningDate: emp.joiningDate ?? "",
      salary: emp.salary != null ? String(emp.salary) : "",
      status: emp.status ?? "Active",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Save (create or update) via API
  const handleSave = async () => {
    const { employeeId, name, email, position } = formData;

    if (
      !employeeId.trim() ||
      !name.trim() ||
      !email.trim() ||
      !position.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...formData,
      salary: formData.salary.trim() === "" ? null : Number(formData.salary),
    };

    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong.");
        return;
      }

      if (isEditing && editingId) {
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingId ? { ...e, ...data.data, id: editingId } : e
          )
        );
      } else {
        setEmployees((prev) => [...prev, { ...data.data, id: data.data._id }]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  // Delete via API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete employee.");
        return;
      }

      setEmployees((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) closeModal();
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  // ✅ Role check
  const canManageUsers = user && adminRoles.includes(user.role);

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
        {canManageUsers && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            onClick={openCreateModal}
          >
            ➕ Add Employee
          </button>
        )}
      </div>

      {!canManageUsers ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <p className="p-6 text-gray-500 text-center">No employees found.</p>
        </div>
      ) : (
        <>
          {/* Search Employee */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🔍 Search Employee
            </h3>
            <div className="relative flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setIsTyping(true);
                  }}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setTimeout(() => setIsTyping(false), 150)} // slight delay to allow click on dropdown
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                  placeholder="Enter Employee ID (e.g., EMP001)"
                />

                {isTyping &&
                  searchId &&
                  (searchResult.length > 0 ? (
                    <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      {/* Header */}
                      <li className="px-4 py-2 bg-gray-100 font-semibold border-b border-gray-300 flex justify-between">
                        <span className="w-1/4">ID</span>
                        <span className="w-1/3">Name</span>
                        <span className="w-1/4">Position</span>
                        <span className="w-1/4">Status</span>
                      </li>

                      {searchResult.map((emp) => {
                        const matchIndex = emp.employeeId
                          .toLowerCase()
                          .indexOf(searchId.toLowerCase());
                        const beforeMatch = emp.employeeId.slice(0, matchIndex);
                        const matchText = emp.employeeId.slice(
                          matchIndex,
                          matchIndex + searchId.length
                        );
                        const afterMatch = emp.employeeId.slice(
                          matchIndex + searchId.length
                        );

                        return (
                          <li
                            key={emp.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                            onClick={() => {
                              setSearchId(emp.employeeId);
                              openEditModal(emp);
                              setSearchResult([]);
                              setIsTyping(false);
                            }}
                          >
                            <span className="w-1/4">
                              {beforeMatch}
                              <span className="font-bold bg-yellow-200">
                                {matchText}
                              </span>
                              {afterMatch}
                            </span>
                            <span className="w-1/3">{emp.name}</span>
                            <span className="w-1/4">{emp.position}</span>
                            <span className="w-1/4">{emp.status}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="absolute z-10 w-full mt-1 px-4 py-3 text-center overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      No Records found.
                    </p>
                  ))}
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (searchId.trim() !== "") {
                      const emp = employees.find(
                        (e) => e.employeeId === searchId.trim()
                      );
                      if (emp) openEditModal(emp);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 h-full rounded-md font-medium transition-colors cursor-pointer"
                >
                  🔍 Search
                </button>
              </div>
            </div>
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
                              : emp.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {Object.entries(emp.documents)
                          .filter(([key, value]) => value)
                          .map(([key]) => key.replace("_", " "))
                          .join(", ") || "No documents"}{" "}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                          onClick={() => openEditModal(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => handleDelete(emp.id)}
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

          {/* Create/Edit Employee Modal */}
          {isModalOpen && (
            <EmployeeModal
              isEditing={isEditing}
              formData={formData}
              handleChange={handleChange}
              closeModal={closeModal}
              handleSave={handleSave}
            />
          )}
        </>
      )}
    </section>
  );
}
