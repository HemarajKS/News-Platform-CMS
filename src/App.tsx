import React from "react";

import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import ArticleManager from "./components/ArticleManager";
import AuthorManager from "./components/AuthorManager";
import CategoryManager from "./components/CategoryManager";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<ArticleManager />} />
        {/* <Route path="articles" element={<ArticleManager />} /> */}
        <Route path="authors" element={<AuthorManager />} />
        <Route path="categories" element={<CategoryManager />} />
      </Route>
    </Routes>
  );
};

export default App;
