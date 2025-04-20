import React, { useEffect, useState } from "react";
import { get, post, put, del } from "../services/api";
import API_LINKS from "../constants/apiLinks";

const AuthorManager = () => {
  const [authors, setAuthors] = useState<any[]>([]);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorImage, setNewAuthorImage] = useState("");
  const [newAuthorDescription, setNewAuthorDescription] = useState("");
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  const [editingAuthorName, setEditingAuthorName] = useState("");
  const [editingAuthorImage, setEditingAuthorImage] = useState("");
  const [editingAuthorDescription, setEditingAuthorDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch authors on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Fetch all authors from the API
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await get<{ data: any[] }>(API_LINKS.AUTHORS.GET_ALL);
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
    setLoading(false);
  };

  // Add a new author
  const handleAddAuthor = async () => {
    if (!newAuthorName.trim()) {
      alert("Author name cannot be empty.");
      return;
    }
    try {
      await post(API_LINKS.AUTHORS.CREATE, {
        authorName: newAuthorName,
        authorImage: newAuthorImage,
        description: newAuthorDescription,
      });
      setNewAuthorName("");
      setNewAuthorImage("");
      setNewAuthorDescription("");
      fetchAuthors();
    } catch (error) {
      console.error("Error adding author:", error);
    }
  };

  // Open the edit modal
  const openEditModal = (author: any) => {
    setEditingAuthorId(author._id);
    setEditingAuthorName(author.authorName);
    setEditingAuthorImage(author.authorImage || "");
    setEditingAuthorDescription(author.description || "");
    setIsEditModalOpen(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditingAuthorId(null);
    setEditingAuthorName("");
    setEditingAuthorImage("");
    setEditingAuthorDescription("");
    setIsEditModalOpen(false);
  };

  // Edit an existing author
  const handleEditAuthor = async () => {
    if (!editingAuthorName.trim()) {
      alert("Author name cannot be empty.");
      return;
    }
    if (editingAuthorId) {
      try {
        await put(API_LINKS.AUTHORS.UPDATE(editingAuthorId), {
          authorName: editingAuthorName,
          authorImage: editingAuthorImage,
          description: editingAuthorDescription,
        });
        closeEditModal();
        fetchAuthors();
      } catch (error) {
        console.error("Error editing author:", error);
      }
    }
  };

  // Delete an author
  const handleDeleteAuthor = async (authorId: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      try {
        await del(API_LINKS.AUTHORS.DELETE(authorId));
        fetchAuthors();
      } catch (error) {
        console.error("Error deleting author:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-800">
        Author Manager
      </h1>

      {/* Add Form */}
      <div className="flex flex-col gap-4 mb-6 rounded-lg border shadow-md p-4">
        <input
          type="text"
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
          placeholder="Author Name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={newAuthorImage}
          onChange={(e) => setNewAuthorImage(e.target.value)}
          placeholder="Author Image URL"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={newAuthorDescription}
          onChange={(e) => setNewAuthorDescription(e.target.value)}
          placeholder="Author Description"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddAuthor}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Add Author
        </button>
      </div>

      {/* Author List */}
      {authors.length > 0 && !loading ? (
        <ul className="space-y-4">
          {authors.map((author) => (
            <li
              key={author._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="text-lg font-medium">{author.authorName}</h3>
                <img
                  src={author.authorImage}
                  alt={author.authorName}
                  className="w-16 h-16 rounded-full object-cover mt-2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {author.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(author)}
                  className="px-3 py-1 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAuthor(author._id)}
                  className="px-3 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        "No authors found."
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Author</h2>
            <input
              type="text"
              value={editingAuthorName}
              onChange={(e) => setEditingAuthorName(e.target.value)}
              placeholder="Author Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />
            <input
              type="text"
              value={editingAuthorImage}
              onChange={(e) => setEditingAuthorImage(e.target.value)}
              placeholder="Author Image URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />
            <textarea
              value={editingAuthorDescription}
              onChange={(e) => setEditingAuthorDescription(e.target.value)}
              placeholder="Author Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAuthor}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorManager;
