﻿using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Linq.Expressions;
using NewCRM.Domain.Entitys;
using NewCRM.Domain.Factory.DomainQuery.Query;
using NewCRM.Domain.Factory.DomainSpecification;
using NewCRM.Domain.Repositories;

namespace NewCRM.Domain.Factory.DomainQuery.ConcreteQuery
{
    [Export("Mongodb", typeof(QueryBase))]
    internal class DefaultQueryFromMongodb : QueryBase
    {
        private readonly IDomainModelQueryProvider _queryProvider;

        [ImportingConstructor]
        public DefaultQueryFromMongodb([Import("Mongodb", typeof(IDomainModelQueryProvider))]IDomainModelQueryProvider queryProvider)
        {
            _queryProvider = queryProvider;
        }

        public override IEnumerable<T> PageBy<T>(Specification<T> specification, Int32 pageIndex, Int32 pageSize, out Int32 totalCount) 
        {
            var query = _queryProvider.Query(specification).OrderByDescending(d => d.AddTime);

            totalCount = query.Count();

            var internalPageIndex = 0;

            if (((pageIndex - 1) * pageSize) == 0)
            {
                internalPageIndex = 5;
            }
            else
            {
                internalPageIndex = (pageIndex - 1) * pageSize;
            }

            return query.Take(internalPageIndex).Take(pageSize);
        }
    }
}