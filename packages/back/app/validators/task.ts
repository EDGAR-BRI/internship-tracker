import vine from '@vinejs/vine'

export const createTaskValidator = vine.create({
  title: vine.string().maxLength(255),
  description: vine.string().maxLength(1000).nullable(),
  status: vine.enum(['pending', 'in_progress', 'done']).optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  dueDate: vine.date().nullable(),
})

export const updateTaskValidator = vine.create({
  title: vine.string().maxLength(255).optional(),
  description: vine.string().maxLength(1000).nullable().optional(),
  status: vine.enum(['pending', 'in_progress', 'done']).optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  dueDate: vine.date().nullable().optional(),
})
