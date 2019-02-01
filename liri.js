require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


var axios = require("axios");

var moment = require ("moment");
moment().format();

var fs = require("fs");

var firstCommnand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument for search purposes

for (var i = 4; i < process.argv.length; i++) {
    secondCommand += " " + process.argv[i];
}

switch (firstCommnand) {
    case "concert-this":
        concertThis(secondCommand);
        break;
    case "spotify-this-song":
        spotifyThis(secondCommand);
        break;
    case "movie-this":
        movieThis(secondCommand)
        break;
    case "do-what-it-says":
        doIt();
    default:
    console.log("please input one of the recognized commands!");
    break;
};

function concertThis(secondCommand) {
    axios.get("https://rest.bandsintown.com/artists/" + secondCommand + "/events?app_id=codingbootcamp")
    .then(function(response){
        for (var i = 0; i < response.data.length; i++) {
            var dateTime = moment (response.data[i].dateTime).format("MM-DD-YY");
            var concertResults =

            "\n--------------------Concert Results--------------------" +
            "\nLineup: " + response.data[i].lineup + 
            "\nVenue Name: " + response.data[i].venue.name + 
            "\nVenue Location: " + response.data[i].venue.city +
            "\nDate of the Event: " + dateTime +
            "\n-------------------------------------------------------\n";

        console.log(concertResults);

        fs.appendFile("log.txt",concertResults, function(err) {
            if (err) {
                console.log(err);
            }
        });
        }  
        console.log("\n-------------------------------------------------------\n" +
        "Your concert results were in logged a text file!" +
        "\n-------------------------------------------------------\n");          
    })
        .catch(function(error){
            console.log(error.response);

        });
}

//Spotify API call 

function spotifyThis(secondCommand) {
    if(secondCommand === undefined){
        secondCommand = "The Sign";
    }

    spotify.search({ type: "track", query: secondCommand})
    .then(function(response){
        for (var i = 0; i < 10; i++) {
            var spotifyResults =
            "\n--------------------Spotify Results--------------------" +
            // artist
            "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
            // song name
            "\nSong Name: " + response.tracks.items[i].name +
            // preview link
            "\nPreview Link: " + response.tracks.items[i].preview_url +
            // album name
            "\nAlbum Name: " + response.tracks.items[i].album.name +
            "\n-------------------------------------------------------\n";

            console.log(spotifyResults);

            fs.appendFile("log.txt", spotifyResults, function(err){                
                if(err){
                    console.log(err);
                }
            });
        }
        console.log("\n-------------------------------------------------------\n" +
            "Your song results were in logged the text file!" +
            "\n-------------------------------------------------------\n");

    })
    .catch(function(error){
        console.log(error.response);
    });
}

function movieThis(secondCommand) {
    if(secondCommand === undefined){
        secondCommand = "mr nobody";
        console.log("\n----------------------------------------" + 
        "\nIf you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +
        "\nIt's on Netflix!") 
    }
    axios.get("https://www.omdbapi.com/?t=" + secondCommand + "&y=&plot=short&apikey=trilogy")
    .then(function(response){
        var movieResults = 
            "\n--------------------Movie Results----------------------" +
            // movie title
            "\nMovie Title: " + response.data.Title + 
            // release year
            "\nYear of Release: " + response.data.Year +
            // IMDB rating
            "\nIMDB Rating: " + response.data.imdbRating +
            // country produced
            "\nCountry Produced: " + response.data.Country +
            // movie language
            "\nLanguage: " + response.data.Language +
            // movie plot
            "\nPlot: " + response.data.Plot +
            // movie cast
            "\nMovie Cast: " + response.data.Actors +
            "\n-------------------------------------------------------\n";

    console.log(movieResults);

    fs.appendFile("log.txt", movieResults, function(err){
        if(err) {
            console.log(err);
        }
    });

    console.log("\n-------------------------------------------------------\n" +
    "Your movie results were in logged the text file!" +
    "\n-------------------------------------------------------\n");
    })
    .catch(function(error){
        console.log(error.response);
    })
}

function doIt(){
    //read random.txt file
    fs.readFile("random.txt", "utf8", function(error, data){
        //splits text in file
        var txt = data.split(',');
        //returns value from text and performs function
        spotifyThis(txt[1]);

    });
}


