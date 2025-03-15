import React from "react";

const Loader = ({
  size = "h-6 w-6",
  color = "text-blue-500",
  className = "",
}) => {
  return (
    <div role="status" aria-label="Loading" className={className}>
      <svg
        className={`animate-spin ${size} ${color} border-t-2 border-b-2 border-white rounded-full`}
        viewBox="0 0 24 24"
      >
        {/* Empty circle will be created by the border styles */}
      </svg>
      <span className="sr-only">Loading...</span> {/* For screen readers */}
    </div>
  );
};

export default Loader;
