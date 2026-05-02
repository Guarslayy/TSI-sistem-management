import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export async function getList<T>(path: string): Promise<T[]> {
  const { data } = await api.get<T[]>(path);
  return data;
}

export async function saveItem<T>(path: string, item: Partial<T> & { id?: number }): Promise<T> {
  const { data } = item.id ? await api.put<T>(`${path}/${item.id}`, item) : await api.post<T>(path, item);
  return data;
}

export async function deleteItem(path: string, id: number): Promise<void> {
  await api.delete(`${path}/${id}`);
}
