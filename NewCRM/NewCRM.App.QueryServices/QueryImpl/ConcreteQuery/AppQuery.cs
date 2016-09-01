﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using NewCRM.Domain.Entities.DomainModel.System;
using NewCRM.Domain.Entities.Repositories;
using NewCRM.Domain.Entities.Repositories.IRepository.System;
using NewCRM.Infrastructure.CommonTools.CustomExtension;
using NewCRM.QueryServices.DomainSpecification;
using NewCRM.QueryServices.Query;

namespace NewCRM.QueryServices.QueryImpl.ConcreteQuery
{
    public sealed class AppQuery : IQuery<App>
    {
        [Import]
        private IRepository<App> AppRepository { get; set; }

        public IEnumerable<App> Find(ISpecification<App> specification)
        {
            return AppRepository.Entities.Where(app => specification.IsSatisfiedBy(app)).ToList();
        }

        public IEnumerable<App> PageBy(ISpecification<App> specification, Int32 pageIndex, Int32 pageSize, out Int32 totalCount)
        {
            var query = AppRepository.Entities.Where(account => specification.IsSatisfiedBy(account)).PageBy(pageIndex, pageSize, d => d.AddTime);
            totalCount = query.Count();
            return query.ToList();
        }
    }
}