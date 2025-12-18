import type { HttpContext } from '@adonisjs/core/http'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import Category from '#models/category'

export default class CategoriesController {


  async menuCategories({ auth, params, response, request }: HttpContext) {
    try {

      const menuId = params.menuId;

      const authenticatedUser = auth.user!

      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(50, Number(request.input('limit', 10)))

      const menu = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      const categories = await menu
        .related('categories')
        .query()
        .paginate(page, limit)

      return response.ok(categories)
    } catch (error) {
      return response.notFound({ message: 'Categories not found.' })
    }
  }

  async showMenuCategory({ auth, params, response }: HttpContext) {
    try {
      const menuId = params.menuId;
      const categoryId = params.categoryId;

      const authenticatedUser = auth.user! 

      const category = await Category
        .query()
        .where('id', categoryId)
        .whereHas('menu', (menuQuery) => {
          menuQuery
            .where('id', menuId)
            .where('user_id', authenticatedUser.id)
        })
        .firstOrFail()

      return response.ok(category)

    } catch (error) {
      return response.notFound({ message: 'Category not found.' })
    }
  }

    async updateMenuCategory({ auth, params, response,request }: HttpContext) {
     
    try {
      const menuId = params.menuId;
      const categoryId = params.categoryId;

      const authenticatedUser = auth.user!

      const validatedData = await request.validateUsing(updateCategoryValidator)

      const category = await Category
        .query()
        .where('id', categoryId)
        .whereHas('menu', (menuQuery) => {
          menuQuery
            .where('id', menuId)
            .where('user_id', authenticatedUser.id)
        })
        .firstOrFail()

        category.merge(validatedData)
        category.save()

      return response.ok({ message: 'Category updated successfully' })

    } catch (error) {
      return response.notFound({ message: 'Category not found.' })
    }
  }

  async storeMenuCategory({ auth, params, request, response }: HttpContext) {
    try {
      const menuId = params.menuId;

      const authenticatedUser = auth.user!

      const validatedData = await request.validateUsing(createCategoryValidator)

      // Find menu that belongs to user
      const userMenu = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      // Create category under the menu
      await userMenu.related('categories').create(validatedData)

      return response.created({ message: 'Category created successfully' })
    } catch (error: any) {
      // Safe error handling
      if (error.messages) {
        return response.badRequest({ errors: error.messages })
      }
      return response.internalServerError({ message: error.message || 'Something went wrong' })
    }
  }


  async deleteMenuCategory({ auth, params, response }: HttpContext) {
    try {

      const menuId = params.menuId;
      const categoryId = params.categoryId;

      const authenticatedUser = auth.user!

      // Find menu that belongs to authenticated user
      const userMenu = await authenticatedUser
        .related('menus')
        .query()
        .where('id', menuId)
        .firstOrFail()

      // Find category under that menu
      const category = await userMenu
        .related('categories')
        .query()
        .where('id', categoryId)
        .firstOrFail()

      // Delete the category
      await category.delete()

      return response.ok({ message: 'Category deleted successfully' })
    } catch (error: any) {
      return response.internalServerError({ message: error.message || 'Something went wrong' })
    }
  }



}
