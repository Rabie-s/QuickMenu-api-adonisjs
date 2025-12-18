import type { HttpContext } from '@adonisjs/core/http'
import { createMenuValidator, updateMenuValidator } from '#validators/menu'
import { upload, deleteFile } from '../../helpers/helpers.js'
import logger from '@adonisjs/core/services/logger'

export default class MenusController {

  async userMenus({ auth, response }: HttpContext) {
    try {
      const authenticatedUser = auth.user!

      const menu = await authenticatedUser.related('menus').query()

      return menu

    } catch (error) {
      
      return response.notFound({ message: 'Menus not found.' })
    }
  }

  async storeMenu({ auth, request, response }: HttpContext) {


    try {
      const authenticatedUser = auth.user!

      const image = request.file('image')

      const validatedData = await request.validateUsing(createMenuValidator) as any

      const menu = await authenticatedUser.related('menus')

      if (image) {
        let imageName = await upload(image, 'menus')
        validatedData.cover_image = await imageName
      }

      menu.create(validatedData)
      return response.created({ message: 'Menu created successfully' })
    } catch (error) {
      console.log(error)
      return response.status(400).send({
        message: 'Validation failed',
        errors: error.messages,
      })
    }

  }


  async updateMenu({ auth, request, response, params }: HttpContext) {
    try {
      const menuId = params.menuId;

      const authenticatedUser = auth.user!

      const image = request.file('image')

      const validatedData = await request.validateUsing(updateMenuValidator) as any

      const menu = await authenticatedUser.related('menus').query().where('id', menuId).firstOrFail()

      if (image) {
        if (menu.cover_image !== null) {
          await deleteFile(menu.cover_image)
        }
        let imageName = await upload(image, 'menus')
        validatedData.cover_image = await imageName
      }

      menu.merge(validatedData)
      menu.save()
      return response.ok({ message: 'Menu updated successfully' })
    } catch (error) {
      return response.notFound({ message: 'Menu not found.' })
    }

  }


  async showMenu({ params, auth, response }: HttpContext) {
    try {
      const menuId = params.menuId;
      const authenticatedUser = auth.user!
      const menu = await authenticatedUser.related('menus').query().where('id', menuId)
      return response.ok(menu)
    } catch (error) {
      return response.notFound({ message: 'Menu not found.' })
    }

  }

  async deleteMenu({ params, auth, response }: HttpContext) {
    const menuId = params.menuId;
    const authenticatedUser = auth.user!
    const menu = await authenticatedUser?.related('menus').query().where('id', menuId).firstOrFail()

    if (menu.cover_image) {
      deleteFile(menu.cover_image)
    }

    menu.delete();
    return response.ok({ message: 'Menu deleted successfully' })
  }
}