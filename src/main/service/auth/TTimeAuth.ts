import TTimeRequest from '../channel/interfaces/TTimeRequest'
import log from '../../utils/log'
import GlobalWin from '../GlobalWin'
import StoreService from '../StoreService'
import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'

/**
 * 授权
 */
class TTimeAuth {
  static token

  static login(token): void {
    // 设置显示我的页面
    StoreService.configSet('setPageMenuIndex', 'myInfo')
    StoreService.configSet('loginStatus', LoginStatusEnum.ING)
    // 强制显示设置窗口
    GlobalWin.forceShowSetWin()
    log.info('开始验证token信息 token = ', token)
    TTimeRequest.getUserInfo(token)
      .then((res) => {
        log.info('用户信息 = ', res)
        if(res['status'] !== 200) {
          this.logout()
          return
        }
        StoreService.configSet('setPageMenuIndex', 'myInfo')
        StoreService.configSet('token', token)
        StoreService.configSet('loginStatus', LoginStatusEnum.Y)
        StoreService.configSet('userInfo', res['data'])
        // 强制显示设置窗口
        GlobalWin.forceShowSetWin()
      })
  }

  static logout(): void {
    log.info('[ 退出登录 ] - 开始')
    TTimeRequest.logout()
      .then((_res) => {
        StoreService.configSet('loginStatus', LoginStatusEnum.N)
        StoreService.configDeleteByKey('userInfo')
        StoreService.configDeleteByKey('token')
        log.info('[ 退出登录 ] - 成功 ')
        // 强制显示设置窗口
        GlobalWin.forceShowSetWin()
      })
      .catch((error) => {
        log.error('[ 退出登录 ] - 异常 ', error)
      })
  }
}

export default TTimeAuth
