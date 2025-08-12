import React from "react";

interface SpinnerProps {
  show?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  show = false,
  text = "Loading...",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
