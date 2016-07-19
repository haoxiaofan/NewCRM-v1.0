﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NewCRM.Application.Services.IApplicationService;
using NewCRM.Domain.Entities.DomainModel.System;
using NewCRM.Domain.Services;
using NewCRM.Dto;
using NewCRM.Dto.Dto;
using NewCRM.Infrastructure.CommonTools.CustomHelper;

namespace NewCRM.Application.Services
{
    [Export(typeof(IDeskApplicationServices))]
    internal class DeskApplicationServices : IDeskApplicationServices
    {
        [Import]
        private IDeskServices _deskServices;


        private readonly Parameter _validateParameter = new Parameter();
        public void ModifyDefaultDeskNumber(Int32 userId, Int32 newDefaultDeskNumber)
        {
            _validateParameter.Validate(userId).Validate(newDefaultDeskNumber);
            _deskServices.ModifyDefaultShowDesk(userId, newDefaultDeskNumber);
        }


        public void ModifyDockPosition(Int32 userId, Int32 defaultDeskNumber, String newPosition)
        {
            _validateParameter.Validate(userId).Validate(defaultDeskNumber).Validate(newPosition);

            _deskServices.ModifyDockPosition(userId, defaultDeskNumber, newPosition);
        }

        public MemberDto GetMember(Int32 userId, Int32 memberId, Boolean isFolder = default(Boolean))
        {
            _validateParameter.Validate(userId).Validate(memberId);
            return _deskServices.GetMember(userId, memberId, isFolder).ConvertToDto<Member, MemberDto>();
        }

        public void MemberInDock(Int32 userId, Int32 memberId)
        {
            _validateParameter.Validate(userId).Validate(memberId);
            _deskServices.MemberInDock(userId, memberId);
        }

        public void MemberOutDock(Int32 userId, Int32 memberId)
        {
            _validateParameter.Validate(userId).Validate(memberId);
            _deskServices.MemberOutDock(userId, memberId);
        }

        public void DockToFolder(Int32 userId, Int32 memberId, Int32 folderId)
        {
            _validateParameter.Validate(userId).Validate(memberId).Validate(folderId);
            _deskServices.DockToFolder(userId, memberId, folderId);
        }
    }
}