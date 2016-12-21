﻿using System;
using System.Collections.Generic;
using NewCRM.Dto.Dto;

namespace NewCRM.Application.Interface
{
    public interface IAccountApplicationServices
    {
        /// <summary>
        /// 用户登陆
        /// </summary>
        /// <param name="accountName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        AccountDto Login(String accountName, String password);

        /// <summary>
        /// 用户登出
        /// </summary>
        /// <param name="accountId"></param>
        void Logout(Int32 accountId);

        /// <summary>
        /// 用户启用
        /// </summary>
        /// <param name="accountId"></param>
        void Enable(Int32 accountId);

        /// <summary>
        /// 用户禁用
        /// </summary>
        /// <param name="accountId"></param>
        void Disable(Int32 accountId);

        /// <summary>
        /// 获取登陆用户的配置文件
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        ConfigDto GetConfig(Int32 accountId);

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
        /// <param name="accountId"></param>
        /// <returns></returns>
        AccountDto GetAccount(Int32 accountId);

        /// <summary>
        /// 添加新的用户
        /// </summary>
        /// <param name="account"></param>
        void AddNewAccount(AccountDto account);

        /// <summary>
        /// 验证相同的用户名是否存在
        /// </summary>
        /// <param name="accountName"></param>
        /// <returns></returns>
        Boolean CheckAccountNameExist(String accountName);

        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="account"></param>
        void ModifyAccount(AccountDto account);

        /// <summary>
        /// 修改账户头像
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="newFace"></param>
        void ModifyAccountFace(Int32 accountId, String newFace);

        /// <summary>
        /// 检查密码
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="oldAccountPassword"></param>
        /// <returns></returns>
        Boolean CheckPassword(Int32 accountId, String oldAccountPassword);

        /// <summary>
        /// 修改账户密码
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="newPassword"></param>
        void ModifyPassword(Int32 accountId, String newPassword);

        /// <summary>
        /// 修改锁屏密码
        /// </summary>
        /// <param name="accountId"></param>
        /// <param name="newScreenPassword"></param>
        void ModifyLockScreenPassword(Int32 accountId, String newScreenPassword);
    }
}