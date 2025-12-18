import type { HttpContext } from '@adonisjs/core/http'
import { createMenuItemValidator, updateMenuItemValidator } from '#validators/menu_item'
import { upload, deleteFile } from '../../helpers/helpers.js'
import MenuItem from '#models/menu_item';


export default class MenuItemsController {

  async menuItems({ auth, params, response, request }: HttpContext) {
    try {

      const menuId = params.menuId;
      const categoryId = params.categoryId;

      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(50, Number(request.input('limit', 10)))


      const authenticatedUser = auth.user as any

      const userMenus = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      const menuCategories = await userMenus
        .related('categories')
        .query()
        .where('id', categoryId)
        .firstOrFail()

      const menuItems = await menuCategories
        .related('menuItems')
        .query()
        .paginate(page, limit)

      return response.ok(menuItems)

    } catch (error) {
      return response.notFound({ message: 'Menu items not found.' })
    }

  }

  async showMenuItem({ auth, params, response }: HttpContext) {
    try {

      const menuId = params.menuId;
      const categoryId = params.categoryId;
      const menuItemId = params.menuItemId

      const authenticatedUser = auth.user as any
      const userMenus = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      const menuCategories = await userMenus
        .related('categories')
        .query()
        .where('id', categoryId)
        .firstOrFail()

      const menuItems = await menuCategories
        .related('menuItems')
        .query()
        .where('id', menuItemId)
        .firstOrFail()

      return response.ok(menuItems)

    } catch (error) {
      return response.notFound({ message: 'Menu item not found.' })
    }

  }

  async storeMenuItem({ auth, params, request, response }: HttpContext) {

    try {
      const menuId = params.menuId;
      const categoryId = params.categoryId;

      const image = request.file('image')


      const authenticatedUser = auth.user!
      const validatedData = await request.validateUsing(createMenuItemValidator) as any

      const userMenus = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      const menuCategories = await userMenus
        .related('categories')
        .query()
        .where('id', categoryId)
        .firstOrFail()

      const menuItems = await menuCategories.related('menuItems')

      if (image) {
        let imageName = await upload(image, 'menuItems')
        validatedData.image = await imageName
      }
      menuItems.create(validatedData)

      return response.created({ message: 'Menu item created successfully' })

    } catch (error) {

      // Safe error handling
      if (error.messages) {
        return response.badRequest({ errors: error.messages })
      }

      return response.notFound({ message: 'Menu item not found.' })
    }

  }
  async updateMenuItem({ auth, params, request, response }: HttpContext) {
    try {
      const { menuId, categoryId, menuItemId } = params
      const image = request.file('image')

      const authenticatedUser = auth.user!
      const validatedData = await request.validateUsing(updateMenuItemValidator) as any

      const menuItem = await MenuItem.query()
        .where('id', menuItemId)
        .whereHas('category', (categoryQuery) => {
          categoryQuery
            .where('id', categoryId)
            .whereHas('menu', (menuQuery) => {
              menuQuery
                .where('id', menuId)
                .where('user_id', authenticatedUser.id)
            })
        })
        .firstOrFail()

      if (image) {
        if (menuItem.image) {
          await deleteFile(menuItem.image)
        }

        const imageName = await upload(image, 'menuItems')
        validatedData.image = imageName
      }

      menuItem.merge(validatedData)
      await menuItem.save()

      return response.ok({ message: 'Menu item updated successfully' })

    } catch (error) {

      // Record not found (firstOrFail)
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Menu item not found' })
      }

      // Validation error
      if (error.messages) {
        return response.badRequest(error.messages)
      }

      // Unexpected error
      console.error(error)
      return response.internalServerError({
        message: 'Something went wrong while updating menu item',
      })
    }
  }


  async deleteMenuItem({ auth, params, response }: HttpContext) {

    const menuId = params.menuId;
    const categoryId = params.categoryId;
    const menuItemId = params.menuItemId

    try {
      const authenticatedUser = auth.user!

      const userMenus = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId).firstOrFail()

      const menuCategories = await userMenus
        .related('categories')
        .query()
        .where('id', categoryId)
        .firstOrFail()

      const menuItems = await menuCategories
        .related('menuItems')
        .query()
        .where('id', menuItemId)
        .firstOrFail()
      if (menuItems.image) {
        await deleteFile(menuItems.image)
      }

      await menuItems.delete()

      return response.ok({ message: 'Menu item deleted successfully' })
    } catch (error: any) {
      if (error.messages) {
        return response.badRequest({ errors: error.messages })
      }

      return response.notFound({ message: 'Menu item not found.' })
    }


  }


}