﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using NewCRM.Domain.DomainQuery.Query;
using NewCRM.Domain.DomainSpecification.Factory;
using NewCRM.Domain.Entitys.Agent;
using NewCRM.Domain.Entitys.System;
using NewCRM.Domain.Factory;
using NewCRM.Domain.Interface.BoundedContext.Agent;
using NewCRM.Domain.Interface.BoundedContext.App;
using NewCRM.Domain.Interface.BoundedContext.Desk;
using NewCRM.Domain.Interface.BoundedContext.Wallpaper;
using NewCRM.Domain.UnitWork;
using NewCRM.Dto;
using NewCRM.Dto.Dto;
using NewCRM.Infrastructure.CommonTools.CustomHelper;

namespace NewCRM.Application.Services.Services
{
    internal class BaseService
    {
        [Import("AccountId", typeof(Int32))]
        protected Int32 AccountId { get; set; }

        [Import]
        protected IUnitOfWork UnitOfWork { get; set; }

        [Import]
        protected IAccountContext AccountContext { get; set; }

        [Import]
        protected IAppContext AppContext { get; set; }

        [Import]
        protected IDeskContext DeskContext { get; set; }

        [Import]
        protected IWallpaperContext WallpaperContext { get; set; }

        /// <summary>
        /// 仓储工厂
        /// </summary>
        [Import]
        protected RepositoryFactory Repository { get; set; }

        /// <summary>
        /// 查询工厂
        /// </summary>
        [Import]
        protected IQuery Query { get; set; }

        /// <summary>
        /// 规约工厂
        /// </summary>
        [Import]
        protected SpecificationFactory FilterFactory { get; set; }

        /// <summary>
        /// 参数验证
        /// </summary>
        protected static Parameter ValidateParameter => new Parameter();
    }
}
