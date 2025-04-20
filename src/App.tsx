import React, { useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import { Route, Routes, useLocation } from "react-router-dom";
import ArticleManager from "./components/ArticleManager";
import AuthorManager from "./components/AuthorManager";
import CategoryManager from "./components/CategoryManager";

const App: React.FC = () => {
  const location = useLocation();

  //On route change scroll to top

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<ArticleManager />} />
        <Route path="authors" element={<AuthorManager />} />
        <Route path="categories" element={<CategoryManager />} />
      </Route>
    </Routes>
  );
};

export default App;
