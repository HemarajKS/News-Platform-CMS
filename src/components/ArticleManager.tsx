import React, { useEffect, useState } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { del, get, post, put } from "../services/api";
import API_LINKS from "../constants/apiLinks";

const ArticleManager = () => {
  const [articles, setArticles] = useState<any>([]);
  const [authors, setAuthors] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [hero, setHero] = useState("");
  const [tags, setTags] = useState<string[]>([]); // Tags as an array
  const [newTag, setNewTag] = useState(""); // Input for adding a new tag
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [articleType, setArticleType] = useState<"TEXT" | "VIDEO" | "AUDIO">(
    "TEXT"
  );
  const [mediaUrl, setMediaUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await get<{ data: any[] }>(API_LINKS.ARTICLES.GET_ALL);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const fetchAuthors = async () => {
    try {
      const response = await get<{ data: any[] }>(API_LINKS.AUTHORS.GET_ALL);
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
      return;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get<{ data: any[] }>(API_LINKS.CATEGORIES.GET_ALL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return;
    }
  };

  interface ArticleData {
    title: string;
    subtitle: string;
    description?: string;
    hero: string;
    tags: string[];
    category: string;
    author: string;
    articleType: "TEXT" | "VIDEO" | "AUDIO";
    mediaUrl?: string;
  }

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const articleData: ArticleData = {
      title,
      subtitle,
      description: articleType === "TEXT" ? description : undefined,
      hero,
      tags, // Send tags as an array
      category: categoryId,
      author: authorId,
      articleType,
      mediaUrl: articleType !== "TEXT" ? mediaUrl : undefined,
    };

    if (isEditing && currentArticleId) {
      await put(API_LINKS.ARTICLES.UPDATE(currentArticleId), articleData);
    } else {
      await post(API_LINKS.ARTICLES.CREATE, articleData);
    }

    resetForm();
    fetchArticles();
  };

  interface Article {
    _id: string; // Added _id property
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    hero: string;
    tags: string[];
    category: string;
    author: string;
    articleType: "TEXT" | "VIDEO" | "AUDIO";
    mediaUrl?: string;
  }

  const handleEdit = (article: Article) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTitle(article.title);
    setSubtitle(article.subtitle);
    setDescription(article.description || "");
    setHero(article.hero);
    setTags(article.tags || []);
    setCategoryId(article.category);
    setAuthorId(article.author);
    setArticleType(article.articleType);
    setMediaUrl(article.mediaUrl || "");
    setIsEditing(true);
    setCurrentArticleId(article._id);
  };

  const handleDelete = async (id: string) => {
    await del(API_LINKS.ARTICLES.DELETE(id));
    fetchArticles();
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setHero("");
    setTags([]);
    setNewTag("");
    setCategoryId("");
    setAuthorId("");
    setArticleType("TEXT");
    setMediaUrl("");
    setIsEditing(false);
    setCurrentArticleId(null);
  };

  const addTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const res = await post(API_LINKS.TAGS.CREATE, { tagName: newTag.trim() });
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-center sm:text-left">
        Article Manager
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded shadow-md flex flex-col"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Hero Image URL"
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select an Author</option>
          {authors.map((author: { _id: string; authorName: string }) => (
            <option key={author._id} value={author._id}>
              {author.authorName}
            </option>
          ))}
        </select>
        <select
          value={articleType}
          onChange={(e) =>
            setArticleType(e.target.value as "TEXT" | "VIDEO" | "AUDIO")
          }
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Article Type</option>
          <option value="TEXT">Text</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
        </select>
        {articleType === "TEXT" ? (
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <JoditEditor
              // ref={editor}
              value={description}
              onChange={(newContent) => setDescription(newContent)}
            />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Media URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Category</option>
          {categories.map((category: { _id: string; categoryName: string }) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? "Update Article" : "Add Article"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
      <h2 className="text-xl font-semibold mt-8 mb-4">Existing Articles</h2>
      {articles.length > 0 && !loading ? (
        <ul className="space-y-4">
          {articles.map((article: Article) => (
            <li
              key={article.id}
              className="p-4 border rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.subtitle}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this article?"
                      )
                    ) {
                      handleDelete(article._id);
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        "No articles found"
      )}
    </div>
  );
};

export default ArticleManager;
