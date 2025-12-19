import type { HttpContext } from '@adonisjs/core/http'
import { createMenuItemValidator, updateMenuItemValidator } from '#validators/menu_item'
import MenuItemService from '#services/menu_items_service'

export default class MenuItemsController {

  async menuItems({ auth, params, request, response }: HttpContext) {
    try {
      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(50, Number(request.input('limit', 10)))

      const menuItems = await MenuItemService.getMenuItems(auth.user!, params.menuId, params.categoryId, page, limit)
      return response.ok(menuItems)
    } catch {
      return response.notFound({ message: 'Menu items not found.' })
    }
  }

  async showMenuItem({ auth, params, response }: HttpContext) {
    try {
      const menuItem = await MenuItemService.getMenuItem(auth.user!, params.menuId, params.categoryId, params.menuItemId)
      return response.ok(menuItem)
    } catch {
      return response.notFound({ message: 'Menu item not found.' })
    }
  }

  async storeMenuItem({ auth, params, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(createMenuItemValidator)
      const imageFile = request.file('image')

      await MenuItemService.createMenuItem(auth.user!, params.menuId, params.categoryId, validatedData, imageFile)
      return response.created({ message: 'Menu item created successfully' })
    } catch (error: any) {
      return response.badRequest({ errors: error.messages || error.message })
    }
  }

  async updateMenuItem({ auth, params, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(updateMenuItemValidator)
      const imageFile = request.file('image')

      await MenuItemService.updateMenuItem(
        auth.user!,
        params.menuId,
        params.categoryId,
        params.menuItemId,
        validatedData,
        imageFile
      )

      return response.ok({ message: 'Menu item updated successfully' })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Menu item not found.' })
      }
      return response.badRequest({ message: error.messages || error.message || 'Something went wrong' })
    }
  }

  async deleteMenuItem({ auth, params, response }: HttpContext) {
    try {
      await MenuItemService.deleteMenuItem(auth.user!, params.menuId, params.categoryId, params.menuItemId)
      return response.ok({ message: 'Menu item deleted successfully' })
    } catch (error: any) {
      return response.notFound({ message: 'Menu item not found.' })
    }
  }
}
