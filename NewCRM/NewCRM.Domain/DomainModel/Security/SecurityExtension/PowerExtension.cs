﻿using System;

namespace NewCRM.Domain.Entities.DomainModel.Security
{
    public partial class Power
    {
        #region public method

        /// <summary>
        /// 修改权限名称
        /// </summary>
        /// <param name="newPowerName"></param>
        public void ModifyPowerName(String newPowerName)
        {
            Name = newPowerName;
        }

        /// <summary>
        /// 移除权限
        /// </summary>
        public void Remove()
        {
            IsDeleted = true;
        }


        #endregion
    }
}
