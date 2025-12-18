

const MenuItemsController = () => import('#controllers/User/menu_items_controller')
export default function(router:any){
    router.get('menus/:menuId/categories/:categoryId/menu-items',[MenuItemsController,'menuItems'])
    router.get('menus/:menuId/categories/:categoryId/menu-items/:menuItemId',[MenuItemsController,'showMenuItem'])
    router.post('menus/:menuId/categories/:categoryId/menu-items',[MenuItemsController,'storeMenuItem'])
    router.put('menus/:menuId/categories/:categoryId/menu-items/:menuItemId',[MenuItemsController,'updateMenuItem'])
    router.delete('menus/:menuId/categories/:categoryId/menu-items/:menuItemId',[MenuItemsController,'deleteMenuItem'])
    
}

