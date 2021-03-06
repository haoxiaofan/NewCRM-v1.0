﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NewCRM.Dto;

namespace NewCRM.Application.Services.Interface
{
    public interface IAccountServices
    {
        #region  have return value

        /// <summary>
        /// 用户登陆
        /// </summary>
        /// <param name="accountName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        Task<AccountDto> LoginAsync(String accountName, String password, String requestIp);

        /// <summary>
        /// 获取登陆用户的配置文件
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        Task<ConfigDto> GetConfigAsync(Int32 accountId);

        /// <summary>
        /// 获取全部的用户
        /// </summary>
        /// <param name="accountName"></param>
        /// <param name="accountType"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        List<AccountDto> GetAccounts(String accountName, String accountType, Int32 pageIndex, Int32 pageSize, out Int32 totalCount);

        /// <summary>
        /// 根据用户id获取用户
        /// </summary>
        /// <returns></returns>
        Task<AccountDto> GetAccountAsync(Int32 accountId = default(Int32));

        /// <summary>
        /// 验证相同的用户名是否存在
        /// </summary>
        /// <param name="accountName"></param>
        /// <returns></returns>
        Task<Boolean> CheckAccountNameExistAsync(String accountName);

        /// <summary>
        ///  检查密码
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="oldAccountPassword"></param>
        /// <returns></returns>
        Task<Boolean> CheckPasswordAsync(Int32 accountId, String oldAccountPassword);

        /// <summary>
        /// 解锁屏幕
        /// </summary>
        /// <returns></returns>
        Task<Boolean> UnlockScreenAsync(Int32 accountId, String unlockPassword);

        /// <summary>
        /// 检查app名称是否已经存在
        /// </summary>
        Task<Boolean> CheckAppNameAsync(String name);

        /// <summary>
        /// 检查appUrl是否存在
        /// </summary>
        Task<Boolean> CheckAppUrlAsync(String url);

        #endregion

        #region not have return value

        /// <summary>
        /// 修改账户密码
        /// </summary>
        Task ModifyPasswordAsync(Int32 accountId, String newPassword, Boolean isTogetherSetLockPassword);

        /// <summary>
        /// 修改锁屏密码
        /// </summary>
        Task ModifyLockScreenPasswordAsync(Int32 accountId, String newScreenPassword);

        /// <summary>
        /// 修改用户
        /// </summary>
        Task ModifyAccountAsync(AccountDto account);

        /// <summary>
        /// 修改账户头像
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="newFace"></param>
        Task ModifyAccountFaceAsync(Int32 accountId, String newFace);

        /// <summary>
        /// 添加新的用户
        /// </summary>
        /// <param name="account"></param>
        Task AddNewAccountAsync(AccountDto account);

        /// <summary>
        /// 用户登出
        /// </summary>
        Task LogoutAsync(Int32 accountId);

        /// <summary>
        /// 用户启用
        /// </summary>
        Task EnableAsync(Int32 accountId);

        /// <summary>
        /// 用户禁用
        /// </summary>
        Task DisableAsync(Int32 accountId);

        /// <summary>
        /// 删除账户
        /// </summary>
        Task RemoveAccountAsync(Int32 accountId);

        #endregion

    }
}
