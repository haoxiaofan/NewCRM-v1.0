﻿using System;
using System.ComponentModel.Composition;
using NewCRM.Domain.Entitys.System;
using NewCRM.Domain.Interface.BoundedContextMember;

namespace NewCRM.Domain.Services.BoundedContextMember
{
    [Export(typeof(ICreateNewFolderServices))]
    internal class CreateNewFolderServices : BaseServiceContext, ICreateNewFolderServices
    {
  
        public void NewFolder(Int32 deskId, String folderName, String folderImg)
        {
            var newMember = new Member(folderName, folderImg, 0);

            var desk = DatabaseQuery.FindOne(FilterFactory.Create((Desk d) => d.Id == deskId));

            Repository.Create<Desk>().Update(desk.AddMember(newMember));
        }
    }
}