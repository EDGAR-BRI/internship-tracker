<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../composables/useTasks'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: number]
  statusChange: [id: number, status: Task['status']]
}>()

const deleting = ref(false)

const priorityColors: Record<string, string> = {
  high: 'border-l-error',
  medium: 'border-l-warning',
  low: 'border-l-text-muted',
}

const priorityLabels: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

const priorityBadgeColors: Record<string, string> = {
  high: 'bg-error/10 text-error',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-text-muted/10 text-text-muted',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Completada',
}

const statusCycle: Record<string, Task['status']> = {
  pending: 'in_progress',
  in_progress: 'done',
  done: 'pending',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(task.dueDate + 'T00:00:00')
  return due < today
}

async function handleDelete() {
  if (deleting.value) return
  deleting.value = true
  emit('delete', props.task.id)
}

function handleStatusToggle() {
  const newStatus = statusCycle[props.task.status]
  emit('statusChange', props.task.id, newStatus)
}
</script>

<template>
  <div
    class="bg-surface border border-border border-l-[3px] rounded-lg p-4 transition-colors hover:border-border-strong"
    :class="priorityColors[task.priority]"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <button
            @click="handleStatusToggle"
            class="flex-shrink-0 w-4 h-4 rounded border transition-colors"
            :class="task.status === 'done'
              ? 'bg-accent border-accent'
              : 'border-border-strong hover:border-accent'"
            :title="`Cambiar estado: ${statusLabels[task.status]}`"
          >
            <svg
              v-if="task.status === 'done'"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <h3
            class="text-sm font-medium text-text truncate"
            :class="{ 'line-through text-text-muted': task.status === 'done' }"
          >
            {{ task.title }}
          </h3>
        </div>

        <p v-if="task.description" class="text-xs text-text-muted ml-6 line-clamp-2 mb-2">
          {{ task.description }}
        </p>

        <div class="flex items-center gap-2 ml-6 flex-wrap">
          <span
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
            :class="priorityBadgeColors[task.priority]"
          >
            {{ priorityLabels[task.priority] }}
          </span>

          <span
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-overlay text-text-secondary"
          >
            {{ statusLabels[task.status] }}
          </span>

          <span
            v-if="task.dueDate"
            class="inline-flex items-center text-[10px] gap-1"
            :class="isOverdue(task) ? 'text-error' : 'text-text-muted'"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="emit('edit', task)"
          class="p-1.5 text-text-muted hover:text-text rounded transition-colors"
          title="Editar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-1.5 text-text-muted hover:text-error rounded transition-colors"
          title="Eliminar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
