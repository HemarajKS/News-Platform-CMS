import React, { useEffect, useState } from "react";
import { get, post, put, del } from "../services/api";
import API_LINKS from "../constants/apiLinks";

const CategoryManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from the API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await get<{ data: any[] }>(API_LINKS.CATEGORIES.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      await post(API_LINKS.CATEGORIES.CREATE, { categoryName: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Save the edited category
  const handleSaveEdit = async (categoryId: string) => {
    if (!editingCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      await put(API_LINKS.CATEGORIES.UPDATE(categoryId), {
        categoryName: editingCategoryName,
      });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  // Delete a category
  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await del(API_LINKS.CATEGORIES.DELETE(categoryId));
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-800">
        Category Manager
      </h1>

      {/* Add Form */}
      <div className="flex items-center gap-4 mb-6 rounded-lg border shadow-md p-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Add Category
        </button>
      </div>

      {/* Category List */}
      {categories.length > 0 && !loading ? (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.categoryId}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              {editingCategoryId === category._id ? (
                // Inline Editing
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => handleSaveEdit(category._id)}
                    className="px-3 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Display Category
                <>
                  <span className="flex-1 text-gray-700">
                    {category.categoryName}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategoryId(category._id);
                        setEditingCategoryName(category.categoryName);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="px-3 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        "No categories found."
      )}
    </div>
  );
};

export default CategoryManager;
