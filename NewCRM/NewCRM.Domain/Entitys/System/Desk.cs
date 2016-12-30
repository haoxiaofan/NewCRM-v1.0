﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using NewCRM.Domain.Entitys.Agent;

namespace NewCRM.Domain.Entitys.System
{
    [Description("桌面"), Serializable]
    public partial class Desk : DomainModelBase, IAggregationRoot
    {
        #region public property

        public Int32 DeskNumber { get; private set; }

        public virtual ICollection<Member> Members { get; private set; }

        public Int32 AccountId { get; set; }
        #endregion


        #region ctor
        public Desk(Int32 deskNumber, Int32 accountId):this()
        {
            DeskNumber = deskNumber;
            Members = new List<Member>();

            AccountId = accountId;
        }


        public Desk() { AddTime = DateTime.Now; }
        #endregion



    }
}
