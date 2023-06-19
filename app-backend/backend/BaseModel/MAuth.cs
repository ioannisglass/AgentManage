using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.BaseModel
{
    [Serializable]
    public class MAuth
    {
        public string email { get; set; }
        public string password { get; set; }
        public string cusid { get; set; }
        public string actkey { get; set; }
        public MAuth()
        {
            cusid = string.Empty;
            actkey = string.Empty;
            email = string.Empty;
            password = string.Empty;
        }
        public MAuth(string email, string password, string cusid, string actkey)
        {
            this.email = email;
            this.password = password;
            this.cusid = cusid;
            this.actkey = actkey;
        }
    }
}
