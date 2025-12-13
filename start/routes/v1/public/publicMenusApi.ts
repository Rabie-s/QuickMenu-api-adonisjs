const PublicMenusController = () => import('#controllers/public/public_menus_controller')

export default function(router:any) {
    router.get('public/menu/:menuId',[PublicMenusController,'index'])
}
