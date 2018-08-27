using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using NameGameDataAccess;

namespace NameGameAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/game")]
    public class GameController : ApiController
    {
        private static GameHelpers gh = new GameHelpers();
        private static JavaScriptSerializer jser = new JavaScriptSerializer();

        [HttpGet, Route("gameUsers")]
        public IHttpActionResult GameUsers()
        {
            DataAccess DA = new DataAccess();
            IEnumerable<User> users = DA.GetUsers();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
            
        }

        [HttpPost, Route("login")]
        public IHttpActionResult Login([FromBody] User user)
        {
            //for this proof on concept we are ignoring password
            DataAccess DA = new DataAccess();
            User usr = DA.ValidateUser(user.UserName, user.Password);
            if (usr == null)
            {
                return Unauthorized();
            }
            return Ok(usr);
            
        }

        [HttpPost, Route("newUser")]
        public HttpResponseMessage NewUser([FromBody] User user)
        {
            DataAccess DA = new DataAccess();
            User usr = DA.CreateNewUser(user);
            if (usr == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Failed to create new user");
            }
            else
            {
                var message = Request.CreateResponse(HttpStatusCode.Created, usr);
                message.Headers.Location = new Uri(Request.RequestUri + usr.UserId.ToString());
                return message;
            }
        }

        [HttpGet, Route("newGame/{userId}/{gameMode}")]
        public HttpResponseMessage NewGame(int userId, string gameMode)
        {

            //check for valid user id
            if (userId < 1) { return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid UserId"); }

            string errorMsg = "";
            Game newGame = gh.CreateGame(userId, gameMode, out errorMsg);
            
            if (errorMsg!="")
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Failed to create new game: Error was: " + errorMsg);
            }
            else
            {
                var message = Request.CreateResponse(HttpStatusCode.Created, newGame);
                message.Headers.Location = new Uri(Request.RequestUri + newGame.GameId.ToString());
                return message;
            }
        }

        [HttpGet, Route("gameQuestion/{gameId}/{qNumber}")]
        public IHttpActionResult GameQuestion(int gameId, int qNumber)
        {
            string questionData = gh.GetQuestion(gameId, qNumber);
            string clueData = gh.GetQuestionClue(gameId, qNumber);
            object retData = new {
                question = questionData,
                clue = clueData
            };

            if (questionData == "")
            {
                return NotFound();
            }
            else
            {
                return Ok(retData);
            }
        }

        [HttpGet, Route("checkAnswer/{gameId}/{qNumber}/{guess}")]
        public IHttpActionResult CheckAnswer(int gameId, int qNumber, int guess)
        {
            string result = gh.CheckAnswer(gameId, qNumber, guess);
            if (result == "")
            {
                return NotFound();
            }
            else
            {
                return Ok(result);
            }
        }
    }
}
