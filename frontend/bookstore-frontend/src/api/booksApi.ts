import axios from 'axios';

export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5001',
});

export async function getBooks(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  category?: string;
}) {
  const response = await apiClient.get<PagedResult<Book>>('/api/books', {
    params,
  });
  return response.data;
}

export async function getCategories(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/api/books/categories');
  return response.data;
}

export async function addBook(book: Omit<Book, 'bookId'>): Promise<Book> {
  const response = await apiClient.post<Book>('/api/books', book);
  return response.data;
}

export async function updateBook(id: number, book: Book): Promise<void> {
  await apiClient.put(`/api/books/${id}`, book);
}

export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/api/books/${id}`);
}
