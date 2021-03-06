﻿using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using NewCRM.Application.Services.Interface;
using NewCRM.Infrastructure.CommonTools;
using Nito.AsyncEx;

namespace NewCRM.Web.Filter
{
	public class AuthFilter : IAuthorizationFilter
	{
		public void OnAuthorization(AuthorizationContext filterContext)
		{

			//if(ValidateToken(filterContext))
			//{
			//	ReturnMessage(filterContext, "token验证失败！");
			//	return;
			//}

			var actionName = filterContext.RequestContext.RouteData.Values["action"].ToString().ToLower();
			var controllerName = filterContext.RequestContext.RouteData.Values["controller"].ToString().ToLower();
			if((controllerName == "desktop" && actionName == "login") || actionName == "landing" || actionName == "index")
			{
				return;
			}

			if(filterContext.HttpContext.Request.Cookies["memberID"] == null)
			{
				ReturnMessage(filterContext, "登陆超时，请刷新页面后重新登陆");
				return;
			}

			if(actionName != "createwindow")
			{
				return;
			}
			//文件夹
			if(filterContext.RequestContext.HttpContext.Request.Form["type"] == "folder")
			{
				return;
			}

			var account = AsyncContext.Run(() => DependencyResolver.Current.GetService<IAccountServices>().GetAccountAsync(Int32.Parse(filterContext.HttpContext.Request.Cookies["memberID"].Value)));

			var appId = Int32.Parse(filterContext.RequestContext.HttpContext.Request.Params["id"]);
			var isPermission = AsyncContext.Run(() => DependencyResolver.Current.GetService<ISecurityServices>().CheckPermissionsAsync(appId, account.Roles.Select(role => role.Id).ToArray()));

			if(!isPermission)
			{
				ReturnMessage(filterContext, "对不起，您没有访问的权限！");
			}
		}

		private void ReturnMessage(AuthorizationContext filterContext, String message)
		{
			var notPermissionMessage = $@"<script>top.alertInfo('{message}',1)</script>";
			var isAjaxRequest = filterContext.RequestContext.HttpContext.Request.IsAjaxRequest();

			if(!isAjaxRequest)
			{
				filterContext.Result = new ContentResult
				{
					ContentEncoding = Encoding.UTF8,
					Content = notPermissionMessage
				};
			}
			else
			{
				var response = new ResponseModel<dynamic>();
				response.IsSuccess = false;
				response.Message = message;

				filterContext.Result = new JsonResult
				{
					ContentEncoding = Encoding.UTF8,
					Data = response,
					JsonRequestBehavior = JsonRequestBehavior.AllowGet
				};
			}
		}

		private Boolean ValidateToken(AuthorizationContext filterContext)
		{
			var token = filterContext.RequestContext.RouteData.Values["token"].ToString();
			if(String.IsNullOrEmpty(token))
			{
				//return false;
			}

			return true;
		}
	}
}