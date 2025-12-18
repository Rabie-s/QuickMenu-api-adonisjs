
const MenuController = () => import('#controllers/User/menus_controller')
export default function(router:any){
    router.get('menus',[MenuController,'userMenus'])
    router.get('menus/:menuId',[MenuController,'showMenu'])
    router.post('menus',[MenuController,'storeMenu'])
    router.put('menus/:menuId',[MenuController,'updateMenu'])
    router.delete('menus/:menuId',[MenuController,'deleteMenu'])
    //menu router
    //router.resource('menus',MenuController).use('*',middleware.auth())
}
