import Category from '#models/category'

export default class CategoryService {

  static async getMenuCategories(user: any, menuId: number, page = 1, limit = 10) {
    const menu = await user.related('menus').query().where('id', menuId).firstOrFail()
    return await menu.related('categories').query().paginate(page, limit)
  }

  static async getMenuCategory(user: any, menuId: number, categoryId: number) {
    return await Category
      .query()
      .where('id', categoryId)
      .whereHas('menu', (menuQuery) => {
        menuQuery.where('id', menuId).where('user_id', user.id)
      })
      .firstOrFail()
  }

  static async createMenuCategory(user: any, menuId: number, data: any) {
    const menu = await user.related('menus').query().where('id', menuId).firstOrFail()
    return await menu.related('categories').create(data)
  }

  static async updateMenuCategory(user: any, menuId: number, categoryId: number, data: any) {
    const category = await this.getMenuCategory(user, menuId, categoryId)
    category.merge(data)
    await category.save()
    return category
  }

  static async deleteMenuCategory(user: any, menuId: number, categoryId: number) {
    const menu = await user.related('menus').query().where('id', menuId).firstOrFail()
    const category = await menu.related('categories').query().where('id', categoryId).firstOrFail()
    await category.delete()
    return category
  }
}
