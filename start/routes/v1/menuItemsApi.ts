

const MenuItemsController = () => import('#controllers/User/menu_items_controller')
export default function(router:any){
    router.get('menus/:menuId/categories/:categoryId/menu-items',[MenuItemsController,'menuItems'])
    router.get('menus/:menuId/categories/:categoryId/menu-items/:meinItemId',[MenuItemsController,'showMenuItem'])
    router.post('menus/:menuId/categories/:categoryId/menu-items',[MenuItemsController,'storeMenuItem'])
    router.delete('menus/:menuId/categories/:categoryId/menu-items/:meinItemId',[MenuItemsController,'deleteMenuItem'])
    
}

