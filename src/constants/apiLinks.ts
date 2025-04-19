const API_LINKS = {
  ARTICLES: {
    GET_ALL: "/articles",
    CREATE: "/articles/create",
    UPDATE: (id: string) => `/articles/edit/${id}`,
    DELETE: (id: string) => `/articles/delete/${id}`,
  },
  CATEGORIES: {
    GET_ALL: "/categories",
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  AUTHORS: {
    GET_ALL: "/authors",
    CREATE: "/authors",
    UPDATE: (id: string) => `/authors/${id}`,
    DELETE: (id: string) => `/authors/${id}`,
  },
  TAGS: {
    GET_ALL: "/tags",
    CREATE: "/tags",
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
  },
};

export default API_LINKS;
