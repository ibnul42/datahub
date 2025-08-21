"use client";

import { adminRoles, manageRoles, roles, User } from "@/constants/user";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const { user } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    username: "",
    email: "",
    role: roles[0],
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.statusText}`);
        }

        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const formattedUsers: User[] = json.data.map(
            (u: User, index: number) => ({
              _id: u._id, // use the actual MongoDB _id
              employeeId: u.employeeId,
              username: u.username,
              email: u.email,
              role: u.role,
              status: u.status,
              lastLogin: u.lastLogin
                ? new Date(u.lastLogin).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Never",
            })
          );
          setUsers(formattedUsers);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    const { employeeId, username, email, role, password } = formData;
    if (!employeeId || !username || !email || !password)
      return alert("Please fill all fields");

    const token = localStorage.getItem("token");
    setCreating(true); // disable button
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          username,
          email,
          role,
          password,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setUsers([
          {
            _id: json.data.id,
            employeeId: json.data.employeeId,
            username: json.data.username,
            email: json.data.email,
            role: json.data.role,
            status: json.data.status,
            lastLogin: "never",
          },
          ...users,
        ]);
        resetForm();
        setSelectedUser(null);
        setShowCreateModal(false);
      } else if (json.errors) {
        const messages = json.errors.map((err: any) => err.msg).join("\n");
        alert(messages);
      } else {
        alert(json.message || "Failed to create user");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    } finally {
      setCreating(false); // enable button
    }
  };

  const handleEditClick = (user: User) => {
    console.log(user);
    setSelectedUser(user);
    setFormData({
      employeeId: user.employeeId,
      username: user.username,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    const { employeeId, username, email, role, password } = formData;
    if (!employeeId || !username || !email)
      return alert("Please fill all fields");

    const token = localStorage.getItem("token");
    setUpdating(true); // disable button

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            username,
            email,
            role,
            ...(password ? { password } : {}),
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setUsers(
          users.map((u: User) =>
            u._id === selectedUser._id
              ? {
                  _id: json.data._id || json.data._id,
                  employeeId: json.data.employeeId,
                  username: json.data.username,
                  email: json.data.email,
                  role: json.data.role,
                  status: json.data.status,
                  lastLogin: json.data.lastLogin
                    ? new Date(json.data.lastLogin).toLocaleString()
                    : "Never",
                }
              : u
          )
        );
        setSelectedUser(null);
        resetForm();
        setShowEditModal(false);
      } else if (json.errors) {
        const messages = json.errors.map((err: any) => err.msg).join("\n");
        alert(messages);
      } else {
        alert(json.message || "Failed to update user");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    } finally {
      setUpdating(false); // enable button
    }
  };

  const handleDeleteUser = async (id: any) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert(json.message || "Failed to delete user");
      }
    } catch (error) {}
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      username: "",
      email: "",
      role: roles[0],
      password: "",
    });
  };

  // ✅ Role check
  const canManageUsers = user && adminRoles.includes(user.role);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            👥 User Management
          </h2>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
        {canManageUsers && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create User
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">No users found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                {canManageUsers && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {u.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {u.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {u.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {u.lastLogin}
                  </td>
                  {canManageUsers && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className={`text-blue-600 mr-3 cursor-pointer hover:text-blue-800 ${
                          user?._id === u._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleEditClick(u)}
                        disabled={user?._id === u._id}
                      >
                        Edit
                      </button>
                      <button
                        className={`text-red-600 cursor-pointer hover:text-red-800 ${
                          user?._id === u._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={user?._id === u._id}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="relative mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New User
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creating}
                className={`px-4 py-2 rounded-md text-white transition-colors cursor-pointer ${
                  creating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="relative mt-20 p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit User
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="name"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New Password (optional)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setFormData({
                    employeeId: "",
                    username: "",
                    email: "",
                    role: roles[0],
                    password: "",
                  });
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updating}
                className={`px-4 py-2 rounded-md text-white transition-colors cursor-pointer ${
                  updating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {updating ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
