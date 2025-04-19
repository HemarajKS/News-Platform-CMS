import React from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">CMS Dashboard</h1>
        <nav className="mt-2">
          <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
            <li>
              <Link to="/" className="hover:underline">
                Manage Articles
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:underline">
                Manage Categories
              </Link>
            </li>
            <li>
              <Link to="/authors" className="hover:underline">
                Manage Authors
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
