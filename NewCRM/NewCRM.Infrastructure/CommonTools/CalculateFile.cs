﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace NewCRM.Infrastructure.CommonTools
{
    public class CalculateFile
    {
        /// <summary>
        /// 计算指定流的MD5值
        /// </summary>
        /// <param name="stream">指定需要计算的流</param>
        /// <returns></returns>
        public static String Calculate(Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("stream is null");
            }
            var md5 = new MD5CryptoServiceProvider();
            md5.ComputeHash(stream);
            var b = md5.Hash;
            md5.Clear();
            var sb = new StringBuilder(32);
            foreach (var t in b)
            {
                sb.Append(t.ToString("X2"));
            }
            
            return sb.ToString();
        }
    }
}