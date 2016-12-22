﻿using System;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web.Mvc;
using NewCRM.Dto.Dto;
using NewCRM.Infrastructure.CommonTools.CustomException;
using NewCRM.Web.Controllers.ControllerHelper;

namespace NewCRM.Web.Controllers
{
    [Export]
    public class SecurityController : BaseController
    {

        #region 页面

        #region 角色

        // GET: SystemAuthority
        public ActionResult RoleManage()
        {
            return View();
        }

        public ActionResult CreateNewRole(Int32 roleId = 0)
        {
            if (roleId != 0)
            {
                ViewData["RoleResult"] = SecurityApplicationServices.GetRole(roleId);
            }

            return View();
        }

        public ActionResult AttachmentPower(Int32 roleId = 0)
        {
            if (roleId != 0)
            {
                ViewData["RolePowerResult"] = SecurityApplicationServices.GetRole(roleId);
            }

            var adminApps = SecurityApplicationServices.GetAllPowers().GroupBy(g => g.PowerIdentity).ToList();

            return View(adminApps);
        }

        #endregion

        #region 权限

        public ActionResult PowerManage()
        {
            return View();
        }


        public ActionResult CreateNewPower(Int32 powerId = 0)
        {
            if (powerId != 0)
            {
                ViewData["PowerResult"] = SecurityApplicationServices.GetPower(powerId);
            }

            return View();
        }


        #endregion

        #endregion

        #region 角色

        /// <summary>
        /// 获取所有的角色
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public ActionResult GetAllRoles(String roleName, Int32 pageIndex, Int32 pageSize)
        {
            var totalCount = 0;

            var roles = SecurityApplicationServices.GetAllRoles(roleName, pageIndex, pageSize, out totalCount);

            return Json(new { roles, totalCount }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 移除角色
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public ActionResult RemoveRole(Int32 roleId)
        {
            SecurityApplicationServices.RemoveRole(roleId);

            return Json(new
            {
                success = 1
            });
        }

        /// <summary>
        /// 添加角色
        /// </summary>
        /// <param name="forms"></param>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public ActionResult NewRole(FormCollection forms, Int32 roleId = 0)
        {
            if (roleId != 0)
            {
                SecurityApplicationServices.ModifyRole(WapperRoleDto(forms));
            }
            else
            {
                SecurityApplicationServices.AddNewRole(WapperRoleDto(forms));
            }
            
            return Json(new
            {
                success = 1
            });
        }

        /// <summary>
        /// 将权限附加到角色中
        /// </summary>
        /// <param name="forms"></param>
        /// <returns></returns>
        public ActionResult AddPowerToRole(FormCollection forms)
        {
            Int32[] powerIds;

            if ((forms["val_powerIds"] + "").Length > 0)
            {
                powerIds = forms["val_powerIds"].Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
            }
            else
            {
                throw new BusinessException("所选的权限列表不能为空");
            }

            SecurityApplicationServices.AddPowerToCurrentRole(Int32.Parse(forms["val_roleId"]), powerIds);

            return Json(new { success = 1 });
        }

        #endregion

        #region 权限

        /// <summary>
        /// 新建权限
        /// </summary>
        /// <param name="forms"></param>
        /// <param name="powerId"></param>
        /// <returns></returns>
        public ActionResult NewPower(FormCollection forms, Int32 powerId = 0)
        {
            if (powerId != 0)
            {
                SecurityApplicationServices.ModifyPower(WapperPowerDto(forms));
            }
            else
            {
                SecurityApplicationServices.AddNewPower(WapperPowerDto(forms));
            }

            return Json(new { success = 1 });
        }

        /// <summary>
        /// 过去全部的权限
        /// </summary>
        /// <param name="powerName"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public ActionResult GetAllPowers(String powerName, Int32 pageIndex, Int32 pageSize)
        {
            Int32 totalCount = 0;

            var powers = SecurityApplicationServices.GetAllPowers(powerName, pageIndex, pageSize, out totalCount);

            return Json(new { powers, totalCount }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 删除权限
        /// </summary>
        /// <param name="powerId"></param>
        /// <returns></returns>
        public ActionResult RemovePower(Int32 powerId)
        {
            SecurityApplicationServices.RemovePower(powerId);

            return Json(new
            {
                success = 1
            });
        }

        #endregion

        #region private method

        private static PowerDto WapperPowerDto(FormCollection forms)
        {
            Int32 powerId = 0;

            if ((forms["powerId"] + "").Length > 0)
            {
                powerId = Int32.Parse(forms["powerId"]);
            }

            return new PowerDto
            {
                PowerIdentity = forms["val_powerIdentity"],
                Name = forms["val_powerName"],
                Remark = forms["val_remark"],
                Id = powerId
            };

        }


        private static RoleDto WapperRoleDto(FormCollection forms)
        {
            Int32 roleId = 0;

            if ((forms["roleId"] + "").Length > 0)
            {
                roleId = Int32.Parse(forms["roleId"]);
            }

            return new RoleDto
            {
                RoleIdentity = forms["val_roleIdentity"],
                Id = roleId,
                Name = forms["val_roleName"],
                Remark = forms["val_roleRemake"]
            };
        }

        #endregion
    }
}