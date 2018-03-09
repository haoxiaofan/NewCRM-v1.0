﻿using System;
using System.Web;
using System.Web.Mvc;
using NewCRM.Application.Services.Interface;
using NewCRM.Dto;
using NewLib.Validate;
using Nito.AsyncEx;
using Unity.Attributes;

namespace NewCRM.Web.Controllers.ControllerHelper
{
    public class BaseController : Controller
    {
        protected ParameterValidate Parameter => new ParameterValidate();

        [Dependency]
        protected IAccountServices AccountServices { get; set; }

        protected AccountDto Account
        {
            get
            {
                var accountId = Request.Cookies["memberID"];
                if (accountId != null)
                {
                    return AsyncContext.Run(() => AccountServices.GetAccountAsync(Int32.Parse(accountId.Value)));
                }
                return null;
            }
        }

        protected void InternalLogout()
        {
            Response.Cookies.Add(new HttpCookie("memberID")
            {
                Expires = DateTime.Now.AddDays(-1)
            });
        }
    }
}
