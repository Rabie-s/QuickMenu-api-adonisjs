import Subscription from '#models/subscription'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Subscription.createMany([
      {
        title:'Free Plan',
        description:'2 menu limit and contain ads.',
        price:0,
        menu_limit:2,
        show_ads:true,
        duration_days:null
      },
       {
        title:'Paid Plan',
        description:"unlimated menus and dosen't contain ads.",
        price:10,
        show_ads:false,
        duration_days:30
      }
    ])
  }
}