using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NameGameDataAccess
{
    public class DataAccess
    {
        public IEnumerable<User> GetUsers()
        {
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                IEnumerable<User> users = entities.Users.ToList();
                return users;
            }
        }

        public User ValidateUser(string username, string password)
        {
            //NOTE: for this proof of conept, we are ignoring password

            //retrieve the userID of an existing user
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                User usr = entities.Users.FirstOrDefault(u => u.UserName == username);
                if (usr == null)
                {
                    //return null indicating user was not found
                    return null;
                }
                else
                {
                    //return User
                    //we don't need to send the password back
                    usr.Password = "";
                    return usr;
                }
            }
        }

        public User CreateNewUser(User user)
        {
            try
            {
                using (NameGameDBEntities entities = new NameGameDBEntities())
                {
                    User usr = entities.Users.FirstOrDefault(u => u.UserName == user.UserName);
                    if (usr == null)
                    {
                        //create new user
                        User newUser = entities.Users.Add(user);
                        entities.SaveChanges();
                        //we don't need to send the password back
                        newUser.Password = "";
                        return newUser;
                    }
                    else
                    {
                        //return null indicating that a user was not created
                        return null;
                    }
                }
            }
            catch(Exception ex)
            {
                return null;
            }
        }

        public Game AddGameToDB(Game newGame)
        {
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                entities.Games.Add(newGame);
                entities.SaveChanges();
                return newGame;
            }
        }

        public Game RetrieveGameFromDB(int gameId)
        {
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                Game game = entities.Games.FirstOrDefault(g => g.GameId == gameId);
                return game;
            }
        }

        public void UpdateGameData(Game game)
        {
            using (NameGameDBEntities entities = new NameGameDBEntities())
            {
                Game gm = entities.Games.FirstOrDefault(g => g.GameId == game.GameId);
                if (gm != null)
                {
                    //only QAttempts and QCompleted should be changing - so comment out the others for now
                    //gm.GameData = game.GameData;
                    //gm.GameMode = game.GameMode;
                    //gm.QAnswers = game.QAnswers;
                    //gm.QCount = game.QCount;
                    gm.QAttempts = game.QAttempts;
                    gm.QCompleted = game.QCompleted;
                    entities.SaveChanges();
                }
            }
        }
    }
}
