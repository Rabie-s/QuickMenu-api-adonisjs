import type { HttpContext } from '@adonisjs/core/http'
import { createCategoryValidator,updateCategoryValidator } from '#validators/category'

export default class CategoriesController {


  async menuCategories({auth,params,response}:HttpContext){
    try {
      const authenticatedUser = auth.user
      const userMenus = await authenticatedUser?.related('menus').query().where('id',params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query()
      return menuCategories
    } catch (error) {
      return response.notFound({ message: 'Categories not found.' })
    }
  }

  async showMenuCategory({auth,params,response}:HttpContext){
    try {
      const authenticatedUser = auth.user
      const userMenus = await authenticatedUser?.related('menus').query().where('id',params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query().where('id',params.categoryId).firstOrFail()
      return menuCategories
    } catch (error) {
      return response.notFound({ message: 'Category not found.' })
    }
  }

  async storeMenuCategory({auth,params,request,response}:HttpContext){
    try {
      
      const authenticatedUser = auth.user
      const validatedData = await request.validateUsing(createCategoryValidator)
      const userMenus = await authenticatedUser?.related('menus').query().where('id',params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories')
      menuCategories.create(validatedData)
      return response.created({ message: 'Category created successfully' })
    } catch (error) {
      return response.send({
        errors: error.messages,
      })
    }
  }

  async deleteMenuCategory({auth,params,response}:HttpContext){
      const authenticatedUser = auth.user
      const userMenus = await authenticatedUser?.related('menus').query().where('id',params.menuId).firstOrFail()
      const menuCategories = await userMenus.related('categories').query().where('id',params.categoryId).firstOrFail()
      menuCategories.delete()
      return response.created({ message: 'Category deleted successfully' })
    
  }


}
