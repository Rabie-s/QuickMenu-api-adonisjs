import type { HttpContext } from '@adonisjs/core/http'
import { createMenuItemValidator, updateMenuItemValidator } from '#validators/menu_item'
import { upload, deleteFile } from '../../helpers/helpers.js'
import { dd } from '@adonisjs/core/services/dumper'

export default class MenuItemsController {

  async menuItems({ auth, params, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user
      const userMenus = await authenticatedUser?.related('menus').query().where('id', params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query().where('id', params.categoryId).firstOrFail()
      const menuItems = await menuCategories.related('menuItems').query()

      return menuItems
    } catch (error) {
      return response.notFound({ message: 'Menu items not found.' })
    }

  }

  async showMenuItem({ auth, params, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user
      const userMenus = await authenticatedUser?.related('menus').query().where('id', params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query().where('id', params.categoryId).firstOrFail()
      const menuItems = await menuCategories.related('menuItems').query().where('id', params.meinItemId).firstOrFail()

      return menuItems
    } catch (error) {
      return response.notFound({ message: 'Menu item not found.' })
    }

  }

  async storeMenuItem({ auth, params, request, response }: HttpContext) {
    

      const image = request.file('image')
      
      const authenticatedUser = auth.user
      const validatedData = await request.validateUsing(createMenuItemValidator)
      const userMenus = await authenticatedUser?.related('menus').query().where('id', params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query().where('id', params.categoryId).firstOrFail()
      const menuItems = await menuCategories.related('menuItems')
      if(image){
        let imageName = await upload(image)
        validatedData.image = imageName
      }
      menuItems.create(validatedData)

      return response.created({ message: 'Menu item created successfully' })
    
  }


  async deleteMenuItem({ auth, params, response }: HttpContext) {

    const authenticatedUser = auth.user
    const userMenus = await authenticatedUser?.related('menus').query().where('id', params.menuId).firstOrFail()
    const menuCategories = await userMenus.related('categories').query().where('id', params.categoryId).firstOrFail()
    const menuItems = await menuCategories.related('menuItems').query().where('id', params.meinItemId).firstOrFail()
    await deleteFile(menuItems.image)
    menuItems.delete()
    return response.ok({ message: 'Menu item deleted successfully' })
  }


}