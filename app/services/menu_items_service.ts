import MenuItem from '#models/menu_item'
import { upload, deleteFile } from '../helpers/helpers.js'

export default class MenuItemService {

  static async getMenuItems(user: any, menuId: number, categoryId: number, page = 1, limit = 10) {
    const menu = await user.related('menus').query().where('id', menuId).firstOrFail()
    const category = await menu.related('categories').query().where('id', categoryId).firstOrFail()
    return await category.related('menuItems').query().paginate(page, limit)
  }

  static async getMenuItem(user: any, menuId: number, categoryId: number, menuItemId: number) {
    return await MenuItem
      .query()
      .where('id', menuItemId)
      .whereHas('category', (categoryQuery) => {
        categoryQuery
          .where('id', categoryId)
          .whereHas('menu', (menuQuery) => {
            menuQuery.where('id', menuId).where('user_id', user.id)
          })
      })
      .firstOrFail()
  }

  static async createMenuItem(user: any, menuId: number, categoryId: number, data: any, imageFile?: any) {
    const menu = await user.related('menus').query().where('id', menuId).firstOrFail()
    const category = await menu.related('categories').query().where('id', categoryId).firstOrFail()

    if (imageFile) {
      const imageName = await upload(imageFile, 'menuItems')
      data.image = imageName
    }

    return await category.related('menuItems').create(data)
  }

  static async updateMenuItem(user: any, menuId: number, categoryId: number, menuItemId: number, data: any, imageFile?: any) {
    const menuItem = await this.getMenuItem(user, menuId, categoryId, menuItemId)

    if (imageFile) {
      if (menuItem.image) {
        await deleteFile(menuItem.image)
      }
      const imageName = await upload(imageFile, 'menuItems')
      data.image = imageName
    }

    menuItem.merge(data)
    await menuItem.save()
    return menuItem
  }

  static async deleteMenuItem(user: any, menuId: number, categoryId: number, menuItemId: number) {
    const menuItem = await this.getMenuItem(user, menuId, categoryId, menuItemId)

    if (menuItem.image) {
      await deleteFile(menuItem.image)
    }

    await menuItem.delete()
    return menuItem
  }
}
