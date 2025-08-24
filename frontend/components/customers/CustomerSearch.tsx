"use client";

import { useState, useRef, useEffect } from "react";
import { Customer } from "./types";

interface CustomerSearchProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export default function CustomerSearch({
  customers,
  onSelectCustomer,
}: CustomerSearchProps) {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Customer[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live search by NID
  useEffect(() => {
    if (!searchId.trim()) {
      setSearchResult([]);
      return;
    }

    const results = customers.filter((c) =>
      c.nidNumber.toLowerCase().includes(searchId.toLowerCase())
    );
    setSearchResult(results);
  }, [searchId, customers]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchResult([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    setSearchId(customer.nidNumber);
    setSearchResult([]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8 relative">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        🔍 Search Customer by NID
      </h3>
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
            placeholder="Enter NID number"
          />
          {/* Dropdown */}
          {searchResult.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <ul>
                <li className="px-4 py-2 bg-gray-100 font-semibold border-b border-gray-300 flex justify-between">
                  <span className="w-1/4">ID</span>
                  <span className="w-1/3">Name</span>
                  <span className="w-1/4">Mobile</span>
                  <span className="w-1/4">NID Status</span>
                </li>
                {searchResult.map((cust) => (
                  <li
                    key={cust._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                    onClick={() => handleSelectCustomer(cust)}
                  >
                    <span className="w-1/4">{cust.nidNumber}</span>
                    <span className="w-1/3">{cust.name}</span>
                    <span className="w-1/4">{cust.mobile}</span>
                    <span className="w-1/4">
                      {cust.nidUploaded ? "Verified" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
