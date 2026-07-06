import Task from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator, updateTaskValidator } from '#validators/task'

export default class TasksController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const tasks = await Task.query().where('userId', user.id).orderBy('createdAt', 'desc')

    return { tasks }
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      ...data,
      userId: user.id,
    })

    return { task }
  }

  async show({ params, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const task = await Task.query().where('id', params.id).where('userId', user.id).firstOrFail()

    return { task }
  }

  async update({ params, request, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const task = await Task.query().where('id', params.id).where('userId', user.id).firstOrFail()

    const data = await request.validateUsing(updateTaskValidator)
    task.merge(data)
    await task.save()

    return { task }
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const task = await Task.query().where('id', params.id).where('userId', user.id).firstOrFail()

    await task.delete()

    return response.noContent()
  }
}
