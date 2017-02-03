﻿using System;
using System.ComponentModel.Composition;
using System.Linq;
using NewCRM.Domain.DomainSpecification;
using NewCRM.Domain.Entitys;
using NewCRM.Domain.Repositories;
using NewCRM.Domain.UnitWork;
using NewCRM.Infrastructure.CommonTools.CustomException;
using NewCRM.Repository.UnitOfWorkProvide;

namespace NewCRM.Repository.DataBaseProvider.EF
{
    /// <summary>
    /// 提供查询
    /// </summary>
    [Export("EF", typeof(IDomainModelQueryProvider))]
    internal class QueryProvider : IDomainModelQueryProvider
    {
        private readonly IUnitOfWork _unitOfWork;

        [ImportingConstructor]
        public QueryProvider(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 查询
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="specification"></param>
        /// <returns></returns>
        public IQueryable<T> Query<T>(Specification<T> specification) where T : DomainModelBase, IAggregationRoot
        {
            var unitfowork = _unitOfWork as UnitOfWorkContextBase;

            if (unitfowork == null)
            {
                throw new RepositoryException($"无法获取工作单元实例:{nameof(unitfowork)}");
            }

            return unitfowork.Set<T, Int32>().Where(specification.Expression);
        }
    }
}