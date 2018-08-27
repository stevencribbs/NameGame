using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Web;
using NameGameAPI;
using NameGameAPI.Controllers;
using NameGameDataAccess;

namespace NameGameAPI.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void Test_CreateGame()
        {
            //A simple test to provide a troubleshooting entry point for the process of creating a game
            GameHelpers gh = new GameHelpers();
            string errorMsg = "";
            Game newGame=gh.CreateGame(1, "normal", out errorMsg);
            //string result = "1";
            Assert.AreNotEqual(null, newGame, "New game was not created");
        }

        [TestMethod]
        public void Test_GetQuestion()
        {
            GameHelpers gh = new GameHelpers();
            //Note: there must be at least one game populated in the database - get the gameId for that game and then test
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                Game game = entities.Games.FirstOrDefault();

                if (game != null)
                {
                    //let's retrieve the data for the first question in the game
                    string question = gh.GetQuestion(8, 1);
                    Assert.AreNotEqual("", question, true, "Game question not found");
                }
                else
                {
                    Assert.Fail("Game not found in database");
                }
            }
        }

        [TestMethod]
        public void Test_CheckAnswer()
        {
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                Game game = entities.Games.FirstOrDefault();
                GameHelpers gh = new GameHelpers();

                string result = gh.CheckAnswer(game.GameId, 1, 6);
                if (result != "")
                {
                    return;
                }
                Assert.AreNotEqual("", result, "no answer found");
            }
        }

        [TestMethod]
        public void Test_CreateNewUser()
        {
            DataAccess da = new DataAccess();
            User user = new User();
            user.FirstName = "Nancy";
            user.LastName = "Clancy";
            user.UserName = "nancyc";
            user.Password = "";
            User newUser=da.CreateNewUser(user);
            int id = newUser.UserId;

            Assert.AreNotEqual(-1, id, "error when attempting to create user");
        }

    }
}
