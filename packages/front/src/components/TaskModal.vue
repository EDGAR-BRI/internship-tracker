<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskFormData } from '../composables/useTasks'

const props = defineProps<{
  task?: Task | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: [task: Task]
}>()

const title = ref('')
const description = ref('')
const status = ref<'pending' | 'in_progress' | 'done'>('pending')
const priority = ref<'low' | 'medium' | 'high'>('medium')
const dueDate = ref('')
const saving = ref(false)
const saveError = ref('')

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.task) {
        title.value = props.task.title
        description.value = props.task.description || ''
        status.value = props.task.status
        priority.value = props.task.priority
        dueDate.value = props.task.dueDate || ''
      } else {
        title.value = ''
        description.value = ''
        status.value = 'pending'
        priority.value = 'medium'
        dueDate.value = ''
      }
      saveError.value = ''
    }
  }
)

async function handleSubmit() {
  if (!title.value.trim()) {
    saveError.value = 'El título es obligatorio'
    return
  }

  saving.value = true
  saveError.value = ''

  try {
    const { useTasks } = await import('../composables/useTasks')
    const { createTask, updateTask } = useTasks()

    const formData: TaskFormData = {
      title: title.value.trim(),
      description: description.value.trim() || null,
      status: status.value,
      priority: priority.value,
      dueDate: dueDate.value || null,
    }

    let savedTask: Task
    if (props.task) {
      savedTask = await updateTask(props.task.id, formData)
    } else {
      savedTask = await createTask(formData)
    }

    emit('saved', savedTask)
    emit('close')
  } catch (e: any) {
    saveError.value = e.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      >
        <div
          class="bg-surface border border-border rounded-lg w-full max-w-md shadow-2xl"
          @click.stop
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 class="text-lg font-semibold text-text">
              {{ task ? 'Editar actividad' : 'Nueva actividad' }}
            </h2>
            <button
              @click="emit('close')"
              class="text-text-muted hover:text-text transition-colors p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
            <div v-if="saveError" class="bg-error/10 border border-error/20 text-error text-sm rounded-md p-3">
              {{ saveError }}
            </div>

            <div class="space-y-1.5">
              <label for="task-title" class="block text-sm text-text-secondary">
                Título <span class="text-error">*</span>
              </label>
              <input
                id="task-title"
                v-model="title"
                type="text"
                placeholder="Nombre de la actividad"
                class="w-full bg-overlay border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-accent"
              />
            </div>

            <div class="space-y-1.5">
              <label for="task-description" class="block text-sm text-text-secondary">
                Descripción
              </label>
              <textarea
                id="task-description"
                v-model="description"
                rows="3"
                placeholder="Detalles de la actividad (opcional)"
                class="w-full bg-overlay border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-accent resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="task-priority" class="block text-sm text-text-secondary">
                  Prioridad
                </label>
                <select
                  id="task-priority"
                  v-model="priority"
                  class="w-full bg-overlay border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-accent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label for="task-status" class="block text-sm text-text-secondary">
                  Estado
                </label>
                <select
                  id="task-status"
                  v-model="status"
                  class="w-full bg-overlay border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-accent"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="done">Completada</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="task-due-date" class="block text-sm text-text-secondary">
                Fecha límite
              </label>
              <input
                id="task-due-date"
                v-model="dueDate"
                type="date"
                class="w-full bg-overlay border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-accent"
              />
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                @click="emit('close')"
                class="px-4 py-2 text-sm text-text-secondary hover:text-text transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                {{ saving ? 'Guardando...' : (task ? 'Guardar cambios' : 'Crear actividad') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
