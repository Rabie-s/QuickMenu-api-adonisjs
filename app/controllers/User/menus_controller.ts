import type { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator } from '#validators/menu'
import MenuService from '#services/menu_service'

export default class MenusController {

  async userMenus({ auth, response }: HttpContext) {
    try {
      const menus = await MenuService.getUserMenus(auth.user!)
      return response.ok(menus)
    } catch {
      return response.notFound({ message: 'Menus not found.' })
    }
  }

  async storeMenu({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(createMenuValidator)
      const imageFile = request.file('image')

      await MenuService.createMenu(auth.user!, validatedData, imageFile)
      return response.created({ message: 'Menu created successfully' })
    } catch (error: any) {
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages || error.message,
      })
    }
  }

  async updateMenu({ auth, request, response, params }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(updateMenuValidator)
      const imageFile = request.file('image')
      const menuId = params.menuId

      await MenuService.updateMenu(auth.user!, menuId, validatedData, imageFile)
      return response.ok({ message: 'Menu updated successfully' })
    } catch (error: any) {
      return response.status(400).send({
        message: error.messages || 'Menu not found.'
      })
    }
  }

  async showMenu({ auth, response, params }: HttpContext) {
    try {
      const menu = await MenuService.getMenu(auth.user!, params.menuId)
      return response.ok(menu)
    } catch {
      return response.notFound({ message: 'Menu not found.' })
    }
  }

  async deleteMenu({ auth, response, params }: HttpContext) {
    try {
      await MenuService.deleteMenu(auth.user!, params.menuId)
      return response.ok({ message: 'Menu deleted successfully' })
    } catch {
      return response.notFound({ message: 'Menu not found.' })
    }
  }
}
