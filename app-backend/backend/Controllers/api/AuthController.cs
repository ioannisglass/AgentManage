using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System;
using backend.BaseModel;
using System.Net.Http.Json;
using System.Threading.Tasks;
using backend.Entities;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly DBContext _dbContext;

        public AuthController(DBContext DBContext)
        {
            this._dbContext = DBContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult create(MAuth _mUser)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://localhost:64189/api/student");

                //HTTP POST
                var postTask = client.PostAsJsonAsync<MAuth>("user", _mUser);
                postTask.Wait();

                var result = postTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
            }

            ModelState.AddModelError(string.Empty, "Server Error. Please contact administrator.");

            return View(_mUser);
        }

        // POST: api/auth/signin
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [Route("signin")]
        public async Task<HttpStatusCode> postUser(User _mUser)
        {
            try
            {
                string w_strCusID = Guid.NewGuid().ToString();
                string w_strNow = DateTime.Now.ToString("dd.MM.yyyy_hh:mm:ss");
                var entity = new User()
                {
                    email = _mUser.email,
                    password = _mUser.password,
                    cusid = w_strCusID,
                    created_at = w_strNow,
                    updated_at = w_strNow
                };

                _dbContext.Users.Add(entity);
                await _dbContext.SaveChangesAsync();

                return HttpStatusCode.Created;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return HttpStatusCode.BadRequest;
            }
        }
    }
}
