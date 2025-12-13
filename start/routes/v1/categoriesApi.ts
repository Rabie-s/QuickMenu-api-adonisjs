
const CategoryController = () => import('#controllers/User/categories_controller')

export default function(router:any){
    router.get('menus/:menuId/categories',[CategoryController,'menuCategories'])
    router.get('menus/:menuId/categories/:categoryId',[CategoryController,'showMenuCategory'])
    router.post('menus/:menuId/categories/',[CategoryController,'storeMenuCategory'])
    router.delete('menus/:menuId/categories/:categoryId',[CategoryController,'deleteMenuCategory'])
}

