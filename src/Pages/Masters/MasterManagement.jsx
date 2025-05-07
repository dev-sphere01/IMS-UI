import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBook, FaMoneyBill, FaClock, FaBullseye } from "react-icons/fa";

const MasterManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const modules = [
    {
      id: "enquiries",
      name: "Enquiries",
      description: "Manage all student enquiries",
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      link: "/enquiry-grid",
    },
    {
      id: "admissions",
      name: "Admissions",
      description: "Manage student admissions",
      icon: <FaUsers className="text-green-500 text-3xl" />,
      link: "/admission-table",
    },
    {
      id: "courses",
      name: "Courses",
      description: "Manage course offerings",
      icon: <FaBook className="text-purple-500 text-3xl" />,
      link: "/course-table",
    },
    {
      id: "fees",
      name: "Fees",
      description: "Manage fee structures",
      icon: <FaMoneyBill className="text-yellow-500 text-3xl" />,
      link: "/fee-table",
    },
    {
      id: "batchTimings",
      name: "Batch Timings",
      description: "Manage available batch timings",
      icon: <FaClock className="text-red-500 text-3xl" />,
      link: "/batch-timing-table",
    },
    {
      id: "goals",
      name: "Course Goals",
      description: "Manage course goals",
      icon: <FaBullseye className="text-indigo-500 text-3xl" />,
      link: "/goal-table",
    },
  ];

  return (
    <div className="p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Master Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center"
            >
              <div className="mb-4">{module.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
              <p className="text-gray-600 text-center">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterManagement;
