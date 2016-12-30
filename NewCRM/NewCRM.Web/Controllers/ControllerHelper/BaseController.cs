﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web.Mvc;
using NewCRM.Application.Interface;
using NewCRM.Dto.Dto;
namespace NewCRM.Web.Controllers.ControllerHelper
{

    public abstract class BaseController : Controller
    {
        [Import]
        protected IAppApplicationServices AppApplicationServices { get; set; }

        [Import]
        protected IDeskApplicationServices DeskApplicationServices { get; set; }

        [Import]
        protected IWallpaperApplicationServices WallpaperApplicationServices { get; set; }

        [Import]
        protected ISkinApplicationServices SkinApplicationServices { get; set; }

        [Import]
        protected IAccountApplicationServices AccountApplicationServices { get; set; }

        [Import]
        protected ISecurityApplicationServices SecurityApplicationServices { get; set; }


        /// <summary>
        /// 当前登陆的账户
        /// </summary>
        [Export(typeof(AccountDto))]
        protected static AccountDto Account { get; set; }


        /// <summary>
        /// 当前用户的配置
        /// </summary>
        protected static ConfigDto AccountConfig { get; set; }

        protected static IEnumerable<DeskDto> Desks { get; set; }

        /// <summary>
        /// 权限判断
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            var controllerName = filterContext.RequestContext.RouteData.Values["controller"].ToString();

            if (controllerName != "App")
            {
                return;
            }

            var actionName = filterContext.RequestContext.RouteData.Values["action"].ToString();

            var isPermission = SecurityApplicationServices.CheckPermissions(actionName, Account.Roles.Select(role => role.Id).ToArray());

            //if (!isPermission)
            //{
            //    var notPermissionMessage = @"<script>setTimeout(function(){window.top.ZENG.msgbox.show('对不起，您没有访问的权限！', 5,3000);},0)</script>";

            //    var isAjaxRequest = filterContext.RequestContext.HttpContext.Request.IsAjaxRequest();

            //    if (!isAjaxRequest)
            //    {
            //        filterContext.Result = new ContentResult
            //        {
            //            ContentEncoding = Encoding.UTF8,
            //            Content = notPermissionMessage
            //        };
            //    }
            //    else
            //    {
            //        filterContext.Result = new JsonResult
            //        {
            //            ContentEncoding = Encoding.UTF8,
            //            Data = new
            //            {
            //                js = notPermissionMessage
            //            },
            //            JsonRequestBehavior = JsonRequestBehavior.AllowGet
            //        };
            //    }
            //}
        }
    }
}
