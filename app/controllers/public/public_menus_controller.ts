 import type { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'
export default class PublicMenusController {
    async index({params}:HttpContext){
        const menu = await Menu.query().where('id',params.menuId).preload('categories',(categoryQuery)=>{
            categoryQuery.preload('menuItems')
        });
        return menu
    }
}