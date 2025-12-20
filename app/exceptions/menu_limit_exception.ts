import { Exception } from '@adonisjs/core/exceptions'

export default class MenuLimitException extends Exception {
  static status = 403
  static code = 'MENU_LIMIT_REACHED'

  constructor(limit: number) {
    super(`You have reached your menu limit (${limit}).`)
  }


}