import type { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator } from '#validators/menu'
export default class MenusController {

  async userMenus({ auth, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user
      const menu = await authenticatedUser?.related('menus').query()
      return menu
    } catch (error) {
      return response.notFound({ message: 'Menus not found.' })
    }

  }

  async storeMenu({ auth, request, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user
      const validatedData = await request.validateUsing(createMenuValidator)
      const menu = await authenticatedUser?.related('menus')
      menu.create(validatedData)
      return response.created({ message: 'Menu created successfully' })
    } catch (error) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }

  }


  async showMenu({ params, auth, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user
      const menu = await authenticatedUser?.related('menus').query().where('id',params.menuId)
      return menu
    } catch (error) {
      return response.notFound({ message: 'Menu not found.' })
    }

  }

  async deleteMenu({ params, auth, response }: HttpContext) {

    const authenticatedUser = auth.user
    const menu = await authenticatedUser?.related('menus').query().where('id',params.menuId).firstOrFail()
    menu.delete();
    return response.ok({ message: 'Menu deleted successfully' })

  }
}