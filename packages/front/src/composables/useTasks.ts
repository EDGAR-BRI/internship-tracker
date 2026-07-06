import { ref } from 'vue'
import { api } from '../lib/api'
import { useAuth } from './useAuth'

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  userId: number
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
}

const tasks = ref<Task[]>([])
const loading = ref(false)
const error = ref('')

export function useTasks() {
  const { token } = useAuth()

  async function fetchTasks() {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get('/tasks', token.value || undefined)
      tasks.value = data.tasks
    } catch (e: any) {
      error.value = e.message || 'Error al cargar tareas'
    } finally {
      loading.value = false
    }
  }

  async function createTask(formData: TaskFormData) {
    error.value = ''
    try {
      const data = await api.post('/tasks', formData, token.value || undefined)
      tasks.value.unshift(data.task)
      return data.task
    } catch (e: any) {
      error.value = e.message || 'Error al crear tarea'
      throw e
    }
  }

  async function updateTask(id: number, formData: Partial<TaskFormData>) {
    error.value = ''
    try {
      const data = await api.put(`/tasks/${id}`, formData, token.value || undefined)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = data.task
      }
      return data.task
    } catch (e: any) {
      error.value = e.message || 'Error al actualizar tarea'
      throw e
    }
  }

  async function deleteTask(id: number) {
    error.value = ''
    try {
      await api.delete(`/tasks/${id}`, token.value || undefined)
      tasks.value = tasks.value.filter((t) => t.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar tarea'
      throw e
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
