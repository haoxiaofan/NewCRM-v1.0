﻿using System;
using System.Collections.Generic;
using NewCRM.Dto.Dto;

namespace NewCRM.Application.Services.Interface
{
    public interface ILoggerServices
    {
        void AddLogger(Int32 accountId, LogDto log);

        IList<LogDto> GetAllLog(Int32 logLevel, Int32 pageIndex, Int32 pageSize,out Int32 totalCount);
    }
}