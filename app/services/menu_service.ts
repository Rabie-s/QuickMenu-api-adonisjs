import { upload, deleteFile } from '../helpers/helpers.js'
import MenuLimitException from '#exceptions/menu_limit_exception'

export default class MenuService {

    static async getUserMenus(user: any) {
        return await user.related('menus').query()
    }

    static async createMenu(user: any, data: any, imageFile: any) {

        const userSubscription = await user
            .related('UserSubscription')
            .query()
            .preload('subscription')
            .firstOrFail()

        const menuLimit = userSubscription.subscription.menuLimit

        // 2️⃣ Count user menus
        const count = await user.related('menus').query().count('* as total')
        const total = Number(count[0].$extras.total)

        // 3️⃣ Check limit (null = unlimited)
        if (menuLimit !== null && total >= menuLimit) {
            throw new MenuLimitException(menuLimit)
        }    // 3️⃣ Check limit (null = unlimited)
        if (menuLimit !== null && total >= menuLimit) {
            throw new MenuLimitException(menuLimit)
        }


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
