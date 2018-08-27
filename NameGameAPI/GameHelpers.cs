using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Net.Http;
using NameGameDataAccess;
using System.Web.Script.Serialization;

namespace NameGameAPI
{
    public class GameHelpers
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private static readonly Random rand = new Random();
        private static readonly JavaScriptSerializer jser = new JavaScriptSerializer();

        public Game CreateGame(int userId, string gameMode, out string errorMsg)
        {
            //build out the questions for a new game - normal mode is 10 basic/random questions
            try
            {
                errorMsg = "";
                DataAccess DA = new DataAccess();
                JavaScriptSerializer jser = new JavaScriptSerializer();
                var response = httpClient.GetStringAsync(new Uri("https://www.willowtreeapps.com/api/v1.0/profiles")).Result;
                object[] arrPeople = jser.Deserialize<object[]>(response);
                int peopleCount = arrPeople.Length;
                int questionCount = 10;
                int sampleSize = 6;

                if (gameMode.ToLower().Contains("small"))
                {
                    questionCount = 5;
                    sampleSize = 4;
                }
                else if (gameMode.ToLower().Contains("large"))
                {
                    questionCount = 20;
                    sampleSize = 10;
                }
                else
                {
                    questionCount = 10;
                    sampleSize = 6;

                }

                List<object> lstQuestions = new List<object>();
                List<int> lstAnswers = new List<int>();
                List<string> lstClues = new List<string>();
                for (int i = 0; i < questionCount; i++)
                {
                    //string data = GenerateQuestionData(sampleSize, arrPeople);
                    int answer = rand.Next(1, sampleSize + 1);
                    string clue = "";
                    List<object> data = GenerateQuestionData(sampleSize, arrPeople, gameMode, answer, out clue);
                    lstClues.Add(clue);
                    lstAnswers.Add(answer);
                    lstQuestions.Add(data);
                }

                //put game data together and store it in the database
                string gameData = jser.Serialize(lstQuestions);
                Game newGame = new Game();
                newGame.UserId = userId;
                newGame.GameMode = gameMode;
                newGame.GameData = gameData;
                newGame.QCount = questionCount;
                newGame.QClues = string.Join(",", lstClues);
                newGame.QAnswers = string.Join(",", lstAnswers);
                newGame.QAttempts = 0;
                newGame.QCompleted = 0;
                newGame = DA.AddGameToDB(newGame);

                return newGame;
                //return jser.Serialize(newGame);
            }
            catch (Exception ex)
            {
                errorMsg = ex.Message;
                return null;
            }
        }

        public List<object> GenerateQuestionData(int sampleSize, object[] arrProfiles, string gameMode, int answer, out string clue)
        {
            //Each question will be based on the data of x number of random people (x number represented in sampleSize; people represented in arrProfiles)

            JavaScriptSerializer jser = new JavaScriptSerializer();
            int iPerson = 0;
            int personCount = 0;
            clue = "";
            
            bool canUse = false;
            int profileCount = arrProfiles.Length;
            List<object> people = new List<object>();

            while (personCount < sampleSize)
            {
                string fName = "";
                string lName = "";
                canUse = false;
                iPerson = rand.Next(profileCount);  //do we care if the number has already been used?  not for now - maybe it gives the user a little help if they get a repeated one
                dynamic dPerson = arrProfiles[iPerson];

                Dictionary<string, object> person = new Dictionary<string, object>();
                //let's add only the data we want - and check a couple of conditions along the way
                foreach (KeyValuePair<string, object> p in dPerson)
                {
                    if (p.Key == "id") { person.Add("id", p.Value); }
                    if (p.Key == "slug") { person.Add("slug", p.Value); }
                    if (p.Key == "jobTitle") { person.Add("jobTitle", p.Value); }
                    if (p.Key == "firstName") {
                        if ((gameMode.ToLower().StartsWith("mat")==true) && (p.Value.ToString().ToLower().StartsWith("mat")==false)){
                            canUse = false;
                            break;
                        }
                        fName = p.Value.ToString();
                        person.Add("firstName", p.Value); }
                    if (p.Key == "lastName") { person.Add("lastName", p.Value); lName = p.Value.ToString(); }
                    if (p.Key == "headshot")
                    {
                        foreach (KeyValuePair<string, object> hs in dPerson["headshot"])
                        {
                            if (hs.Key == "url")
                            {
                                person.Add("headshotUrl", hs.Value);
                                canUse = true;
                                break;
                            }
                        }
                    }
                }
                if (canUse)
                {
                    //we can only use the person if there is a headshot image
                    personCount++;
                    if (personCount == answer)
                    {
                        //create the question clue (first and last name)
                        clue = fName + " " + lName;
                    }
                    people.Add(person);
                }
            }

            return people;
        }

        public string GetQuestion(int gameId, int qNumber)
        {
            //use the gameId to retrieve the game from the DB; then parse the game data to retrieve the specific question data
            DataAccess DA = new DataAccess();
            Game game = DA.RetrieveGameFromDB(gameId);
            string result = "";
            if (qNumber <= game.QCount)
            {
                var questions = game.GameData;
                object[] quests = jser.Deserialize<object[]>(questions);
                result = jser.Serialize(quests[qNumber - 1]);  //remember 0-based array vs 1-based qNumber
            }
            else
            {
                result = "done";
            }
            return result;
        }

        public string GetQuestionClue(int gameId, int qNumber)
        {
            DataAccess DA = new DataAccess();
            Game game = DA.RetrieveGameFromDB(gameId);
            string result = "";
            if (qNumber <= game.QCount)
            {
                string[] clues = game.QClues.Split(',');
                result = clues[qNumber - 1];
            }
            else
            {
                result = "error: question number does not exist in this game";
            }
            return result;
        }

        public string CheckAnswer(int gameId, int qNumber, int guess)
        {
            try
            {
                string retVal = "";
                DataAccess DA = new DataAccess();
                Game game = DA.RetrieveGameFromDB(gameId);
                if (qNumber <= game.QCount)
                {
                    string[] answers = game.QAnswers.Split(',');
                    if (Convert.ToInt32(answers[qNumber - 1]) == guess)
                    {
                        //update DB for QAttempts and QCompleted
                        game.QAttempts = game.QAttempts + 1;
                        game.QCompleted = game.QCompleted + 1;
                        retVal = "correct";
                    }
                    else
                    {
                        //update DB for QAttempts
                        game.QAttempts = game.QAttempts + 1;
                        retVal = "incorrect";
                    }
                    DA.UpdateGameData(game);
                    return retVal;
                }
                else
                {
                    return "error: question number does not exist in this game";
                }
            }
            catch(Exception ex)
            {
                return "error: " + ex.Message;
            }
        }
    }
}