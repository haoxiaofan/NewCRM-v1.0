﻿using System;
using System.ComponentModel.Composition;
using System.Linq;
using NewCRM.Domain.Entitys.System;
using NewCRM.Domain.Interface.BoundedContextMember;
using NewCRM.Domain.Services.Service;
using NewCRM.Domain.ValueObject;
using NewCRM.Infrastructure.CommonTools.CustomException;

namespace NewCRM.Domain.Services.BoundedContextMember
{
    [Export(typeof(IInstallAppServices))]
    internal sealed class InstallAppServices : BaseService, IInstallAppServices
    {
        public void Install(Int32 appId, Int32 deskNum)
        {
            var desks = GetDesks();

            var realDeskId = desks.FirstOrDefault(desk => desk.DeskNumber == deskNum).Id;

            var appResult = Query.FindOne(FilterFactory.Create<App>(app => app.AppAuditState == AppAuditState.Pass && app.AppReleaseState == AppReleaseState.Release && app.Id == appId));

            if (appResult == null)
            {
                throw new BusinessException($"应用添加失败，请刷新重试");
            }

            var newMember = new Member(appResult.Name, appResult.IconUrl, appResult.AppUrl, appResult.Id, appResult.Width, appResult.Height, appResult.IsLock, appResult.IsMax, appResult.IsFull, appResult.IsSetbar, appResult.IsOpenMax, appResult.IsFlash, appResult.IsDraw, appResult.IsResize);

            foreach (var desk in desks)
            {
                if (desk.Id != realDeskId)
                {
                    continue;
                }

                desk.Members.Add(newMember);
                Repository.Create<Desk>().Update(desk);

                appResult.AddUseCount();
                Repository.Create<App>().Update(appResult);

                break;
            }
        }
    }
}
