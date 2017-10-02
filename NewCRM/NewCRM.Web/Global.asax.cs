﻿using NewCRM.Repository.DataBaseProvider.EF;
using System.Data.Entity;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using NewCRM.Repository.DatabaseProvider.EF.Context;

namespace NewCRM.Web
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			Database.SetInitializer(new CreateDatabaseIfNotExists<NewCrmBackContext>());

			AreaRegistration.RegisterAllAreas();

			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

			RouteConfig.RegisterRoutes(RouteTable.Routes);

			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}
	}
}
