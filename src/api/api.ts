import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  healthCheck: (): Promise<AxiosResponse<{ status: string, qdrant_connection: string }>> => api.get('/health'),
  getCollectionStats: (): Promise<AxiosResponse<{
    distance: string;
    name: string;
    point_count: number;
    vector_count: number | null;
    vector_size: number;
  }>> => api.get('/collection_stats'),
  listTasks: (limit: number, offset: number): Promise<AxiosResponse<any[]>> => 
    api.get('/list_tasks', { params: { limit, offset } }),
  getTask: (id: number) => api.get(`/get_task/${id}`),
  findDuplicates: (threshold: number) => api.get('/find_duplicates', { params: { threshold } }),
  searchSimilarTasks: (query: string, threshold: number, limit: number) => 
    api.post('/search_similar_tasks', { query, threshold, limit }),
  hybridSearch: (query: string, limit: number, semanticWeight: number) => 
    api.post('/hybrid_search', { query, limit, semantic_weight: semanticWeight }),
  semanticSearch: (query: string, limit: number) => 
    api.post('/semantic_search', { query, limit }),
  addTask: (subject: string, description: string) => 
    api.post('/add_task', { subject, description }),
};