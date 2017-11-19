﻿using System;
using System.Linq;
using NewCRM.Application.Services.Interface;
using NewCRM.Domain;
using NewCRM.Domain.Entitys.Agent;
using NewCRM.Domain.Entitys.System;
using NewCRM.Domain.Repositories.IRepository.Agent;
using NewCRM.Domain.Repositories.IRepository.System;
using NewCRM.Domain.Services.Interface;
using NewCRM.Domain.ValueObject;
using NewCRM.Dto;
using NewCRM.Infrastructure.CommonTools.CustomException;

namespace NewCRM.Application.Services
{
    public class DeskServices : BaseServiceContext, IDeskServices
    {
        private readonly IModifyDeskMemberServices _modifyDeskMemberServices;
        private readonly IModifyDockPostionServices _modifyDockPostionServices;
        private readonly ICreateNewFolderServices _createNewFolderServices;
        private readonly IModifyDeskMemberPostionServices _modifyDeskMemberPostionServices;
        private readonly IDeskRepository _deskRepository;

        private readonly IAccountRepository _accountRepository;

        public DeskServices(IModifyDeskMemberServices modifyDeskMemberServices,
            IModifyDockPostionServices modifyDockPostionServices,
            ICreateNewFolderServices createNewFolderServices,
            IModifyDeskMemberPostionServices modifyDeskMemberPostionServices, IAccountRepository accountRepository, IDeskRepository deskRepository)
        {
            _modifyDeskMemberServices = modifyDeskMemberServices;
            _modifyDockPostionServices = modifyDockPostionServices;
            _createNewFolderServices = createNewFolderServices;
            _modifyDeskMemberPostionServices = modifyDeskMemberPostionServices;
            _deskRepository = deskRepository;

            _accountRepository = accountRepository;
        }

        public MemberDto GetMember(Int32 accountId, Int32 memberId, Boolean isFolder)
        {
            ValidateParameter.Validate(accountId).Validate(memberId);

            var desks = CacheQuery.Find(FilterFactory.Create((Desk desk) => desk.AccountId == accountId));
            foreach(var desk in desks)
            {
                MemberType memberType;
                var members = desk.Members;
                if(isFolder)
                {
                    memberType = MemberType.Folder;
                }
                else
                {
                    memberType = MemberType.App;
                }
                var result = members.FirstOrDefault(member => member.AppId == memberId && member.MemberType == memberType);
                if(result != null)
                {
                    return new MemberDto
                    {
                        AppId = result.AppId,
                        AppUrl = result.AppUrl,
                        DeskId = result.DeskId,
                        FolderId = result.FolderId,
                        Height = result.Height,
                        IconUrl = result.IconUrl,
                        Id = result.Id,
                        IsDraw = result.IsDraw,
                        IsFlash = result.IsFlash,
                        IsFull = result.IsFull,
                        IsLock = result.IsLock,
                        IsMax = result.IsMax,
                        IsOnDock = result.IsOnDock,
                        IsOpenMax = result.IsOpenMax,
                        IsResize = result.IsResize,
                        IsSetbar = result.IsSetbar,
                        MemberType = result.MemberType.ToString(),
                        Name = result.Name,
                        Width = result.Width
                    };
                }
            }
            throw new BusinessException($"未找到app");
        }

        public void ModifyDefaultDeskNumber(Int32 accountId, Int32 newDefaultDeskNumber)
        {
            ValidateParameter.Validate(accountId).Validate(newDefaultDeskNumber);

            var accountResult = DatabaseQuery.FindOne(FilterFactory.Create((Account account) => account.Id == accountId));
            accountResult.Config.ModifyDefaultDesk(newDefaultDeskNumber);

            _accountRepository.Update(accountResult);
            UnitOfWork.Commit();
        }

        public void ModifyDockPosition(Int32 accountId, Int32 defaultDeskNumber, String newPosition)
        {
            ValidateParameter.Validate(accountId).Validate(defaultDeskNumber).Validate(newPosition);

            _modifyDockPostionServices.ModifyDockPosition(accountId, defaultDeskNumber, newPosition);
            UnitOfWork.Commit();
        }

        public void MemberInDock(Int32 accountId, Int32 memberId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId);

            _modifyDeskMemberPostionServices.MemberInDock(accountId, memberId);
            UnitOfWork.Commit();
        }

        public void MemberOutDock(Int32 accountId, Int32 memberId, Int32 deskId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(deskId);

            _modifyDeskMemberPostionServices.MemberOutDock(accountId, memberId, deskId);
            UnitOfWork.Commit();
        }

        public void DockToFolder(Int32 accountId, Int32 memberId, Int32 folderId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(folderId);

            _modifyDeskMemberPostionServices.DockToFolder(accountId, memberId, folderId);
            UnitOfWork.Commit();
        }

        public void FolderToDock(Int32 accountId, Int32 memberId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId);

            _modifyDeskMemberPostionServices.FolderToDock(accountId, memberId);
            UnitOfWork.Commit();
        }

        public void DeskToFolder(Int32 accountId, Int32 memberId, Int32 folderId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(folderId);

            _modifyDeskMemberPostionServices.DeskToFolder(accountId, memberId, folderId);
            UnitOfWork.Commit();
        }

        public void FolderToDesk(Int32 accountId, Int32 memberId, Int32 deskId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(deskId);

            _modifyDeskMemberPostionServices.FolderToDesk(accountId, memberId, deskId);
            UnitOfWork.Commit();
        }

        public void FolderToOtherFolder(Int32 accountId, Int32 memberId, Int32 folderId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(folderId);

            _modifyDeskMemberPostionServices.FolderToOtherFolder(accountId, memberId, folderId);
            UnitOfWork.Commit();
        }

        public void DeskToOtherDesk(Int32 accountId, Int32 memberId, Int32 deskId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(deskId);

            _modifyDeskMemberPostionServices.DeskToOtherDesk(accountId, memberId, deskId);
            UnitOfWork.Commit();
        }

        public void ModifyFolderInfo(Int32 accountId, String memberName, String memberIcon, Int32 memberId)
        {
            ValidateParameter.Validate(accountId).Validate(memberName).Validate(memberIcon).Validate(memberId);

            _modifyDeskMemberServices.ModifyFolderInfo(accountId, memberName, memberIcon, memberId);
            UnitOfWork.Commit();
        }

        public void RemoveMember(Int32 accountId, Int32 memberId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId);

            _modifyDeskMemberServices.RemoveMember(accountId, memberId);
            UnitOfWork.Commit();
        }

        public void ModifyMemberInfo(Int32 accountId, MemberDto member)
        {
            ValidateParameter.Validate(accountId).Validate(member);

            _modifyDeskMemberServices.ModifyMemberInfo(accountId, member.ConvertToModel<MemberDto, Member>());
            UnitOfWork.Commit();
        }

        public void CreateNewFolder(String folderName, String folderImg, Int32 deskId)
        {
            ValidateParameter.Validate(folderName).Validate(folderImg).Validate(deskId);

            _createNewFolderServices.NewFolder(deskId, folderName, folderImg);
            UnitOfWork.Commit();
        }

        public void DockToOtherDesk(Int32 accountId, Int32 memberId, Int32 deskId)
        {
            ValidateParameter.Validate(accountId).Validate(memberId).Validate(deskId);

            _modifyDeskMemberPostionServices.DockToOtherDesk(accountId, memberId, deskId);
            UnitOfWork.Commit();
        }

        public void ModifyMemberIcon(Int32 accountId, Int32 memberId, String newIcon)
        {
            #region 参数验证
            ValidateParameter.Validate(memberId).Validate(newIcon);
            #endregion

            _modifyDeskMemberServices.ModifyMemberIcon(accountId, memberId, newIcon);

            UnitOfWork.Commit();
        }
    }
}