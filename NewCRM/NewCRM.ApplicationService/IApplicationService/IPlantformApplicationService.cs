﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NewCRM.Domain.DomainModel.Account;
using NewCRM.Dto.Dto;
using NewCRM.Infrastructure.CommonTools;

namespace NewCRM.ApplicationService.IApplicationService
{
    public interface IPlantformApplicationService
    {
        ResponseInformation<UserDto> Login(String userName, String passWord);

        ResponseInformation<dynamic> UserApp(Int32 userId);

        ResponseInformation<Boolean> DefaultDesk(Int32 userId, Int32 deskId);

        ResponseInformation<Boolean> AppDirection(Int32 userId, String direction);

        ResponseInformation<Boolean> AppSize(Int32 userId, Int32 appSize);

        ResponseInformation<Boolean> AppVertical(Int32 userId, Int32 appVertical);

        ResponseInformation<Boolean> AppHorizontal(Int32 userId, Int32 appHorizontal);


        ResponseInformation<Boolean> DockPosition(Int32 userId, String pos, Int32 deskNum);

        ResponseInformation<Boolean> Skin(Int32 userId, String skin);

        ResponseInformation<IDictionary<String, dynamic>> AllSkin(String skinPath);

        Task<ResponseInformation<Boolean>> WebImgAsync(Int32 userId, String webImg);

        ResponseInformation<IDictionary<Int32, Tuple<String, String>>> Wallpapers();

    }
}