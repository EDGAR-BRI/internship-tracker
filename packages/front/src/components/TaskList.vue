<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasks, type Task } from '../composables/useTasks'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'

const { tasks, loading, error, fetchTasks, deleteTask, updateTask } = useTasks()

const showModal = ref(false)
const editingTask = ref<Task | null>(null)
const activeFilter = ref<'all' | Task['status']>('all')
const confirmDeleteId = ref<number | null>(null)

const filters: { value: 'all' | Task['status']; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'done', label: 'Completadas' },
]

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') return tasks.value
  return tasks.value.filter((t) => t.status === activeFilter.value)
})

const taskCounts = computed(() => ({
  all: tasks.value.length,
  pending: tasks.value.filter((t) => t.status === 'pending').length,
  in_progress: tasks.value.filter((t) => t.status === 'in_progress').length,
  done: tasks.value.filter((t) => t.status === 'done').length,
}))

onMounted(() => {
  fetchTasks()
})

function openCreateModal() {
  editingTask.value = null
  showModal.value = true
}

function openEditModal(task: Task) {
  editingTask.value = task
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTask.value = null
}

async function handleDelete(id: number) {
  if (confirmDeleteId.value === id) {
    await deleteTask(id)
    confirmDeleteId.value = null
  } else {
    confirmDeleteId.value = id
    setTimeout(() => {
      if (confirmDeleteId.value === id) {
        confirmDeleteId.value = null
      }
    }, 3000)
  }
}

async function handleStatusChange(id: number, status: Task['status']) {
  await updateTask(id, { status })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Actividades</h1>
      <button
        @click="openCreateModal"
        class="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva actividad
      </button>
    </div>

    <div class="flex items-center gap-1 border-b border-border">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="activeFilter = filter.value"
        class="px-3 py-2 text-sm font-medium transition-colors relative"
        :class="activeFilter === filter.value
          ? 'text-text'
          : 'text-text-muted hover:text-text-secondary'"
      >
        {{ filter.label }}
        <span
          v-if="taskCounts[filter.value] > 0"
          class="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-overlay"
        >
          {{ taskCounts[filter.value] }}
        </span>
        <div
          v-if="activeFilter === filter.value"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
        ></div>
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="w-6 h-6 border-2 border-border-strong border-t-accent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="bg-error/10 border border-error/20 text-error text-sm rounded-md p-4">
      {{ error }}
      <button @click="fetchTasks" class="ml-2 underline hover:no-underline">Reintentar</button>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <svg class="w-12 h-12 mx-auto text-text-disabled mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-text-muted text-sm">
        {{ activeFilter === 'all'
          ? 'No hay actividades. Crea una para empezar.'
          : 'No hay actividades en esta categoría.'
        }}
      </p>
    </div>

    <div v-else class="space-y-3">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @edit="openEditModal"
        @delete="handleDelete"
        @status-change="handleStatusChange"
      />
    </div>

    <TaskModal
      :is-open="showModal"
      :task="editingTask"
      @close="closeModal"
      @saved="closeModal"
    />
  </div>
</template>
