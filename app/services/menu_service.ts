import { upload, deleteFile } from '../helpers/helpers.js'

export default class MenuService {

    static async getUserMenus(user: any) {
        return await user.related('menus').query()
    }

    static async createMenu(user: any, data: any, imageFile: any) {
        if (imageFile) {
            const imageName = await upload(imageFile, 'menus')
            data.cover_image = imageName
        }

        return await user.related('menus').create(data)
    }

    static async updateMenu(user: any, menuId: number, data: any, imageFile: any) {
        const menu = await user.related('menus').query().where('id', menuId).firstOrFail()

        if (imageFile) {
            if (menu.cover_image) {
                await deleteFile(menu.cover_image)
            }
            const imageName = await upload(imageFile, 'menus')
            data.cover_image = imageName
        }

        menu.merge(data)
        await menu.save()
        return menu
    }

    static async getMenu(user: any, menuId: number) {
        return await user.related('menus').query().where('id', menuId).firstOrFail()
    }

    static async deleteMenu(user: any, menuId: number) {
        const menu = await user.related('menus').query().where('id', menuId).firstOrFail()

        if (menu.cover_image) {
            await deleteFile(menu.cover_image)
        }

        await menu.delete()
        return menu
    }
}
