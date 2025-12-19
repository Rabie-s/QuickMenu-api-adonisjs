import type { HttpContext } from '@adonisjs/core/http'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import CategoryService from '#services/categories_service'

export default class CategoriesController {

  async menuCategories({ auth, params, request, response }: HttpContext) {
    try {
      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(50, Number(request.input('limit', 10)))

      const categories = await CategoryService.getMenuCategories(auth.user!, params.menuId, page, limit)
      return response.ok(categories)
    } catch {
      return response.notFound({ message: 'Categories not found.' })
    }
  }

  async showMenuCategory({ auth, params, response }: HttpContext) {
    try {
      const category = await CategoryService.getMenuCategory(auth.user!, params.menuId, params.categoryId)
      return response.ok(category)
    } catch {
      return response.notFound({ message: 'Category not found.' })
    }
  }

  async storeMenuCategory({ auth, params, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(createCategoryValidator)
      await CategoryService.createMenuCategory(auth.user!, params.menuId, validatedData)
      return response.created({ message: 'Category created successfully' })
    } catch (error: any) {
      return response.badRequest({ errors: error.messages || error.message })
    }
  }

  async updateMenuCategory({ auth, params, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(updateCategoryValidator)
      await CategoryService.updateMenuCategory(auth.user!, params.menuId, params.categoryId, validatedData)
      return response.ok({ message: 'Category updated successfully' })
    } catch (error: any) {
      return response.badRequest({ message: error.messages || 'Category not found.' })
    }
  }

  async deleteMenuCategory({ auth, params, response }: HttpContext) {
    try {
      await CategoryService.deleteMenuCategory(auth.user!, params.menuId, params.categoryId)
      return response.ok({ message: 'Category deleted successfully' })
    } catch (error: any) {
      return response.internalServerError({ message: error.message || 'Something went wrong' })
    }
  }
}
