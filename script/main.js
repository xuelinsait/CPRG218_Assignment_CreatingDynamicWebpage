/**
 * To complete this Assignment follow below steps
 * 1.) Go to: OMDB website (https://www.omdbapi.com/)
 * 2.) In top navigation menu select "API Key"
 * 3.) Select Free account type and give your email address.
 * 4.) Go to your mail box and find the mail from OMDB.
 * 5.) You will receive the API Key in your mail along with a link to activate your key. Select the link to activate your key
 * 6.) Update the "myApiKey" variable with the API key from your mail. IMPORTANT: Before uploading your code to Github or Brightspace, delete your key from this file.
 * 7.) There are 3 task in this that you have to complete. Discuss with your instructor to understand the task.
 */

// const { createElement } = require("react");

const myApiKey = ""; // <<-- ADD YOUR API KEY HERE. DELETE THIS KEY before uploading your code on Github or Brightspace, 

const BASE_URL = "http://www.omdbapi.com";


document.addEventListener('DOMContentLoaded', addEventHandlers);    // calling addEventHandlers function once the html document is loaded.

/**
 * Gets the value entered in the search bar and pass that value to getMovies function.
 */
function searchHandler() {
    const inputTxt = document.getElementById("searchBar").value;
    console.log(`Text Entered: ${inputTxt}`);
    if (inputTxt != "") {
        clearPreviousResult();
        getMovies(inputTxt);
    }
}

/**
 * Add event handler to search icon and search bar. When user click the search icon or when user
 * press "Enter" key while typing in search bar, "searchHandler" function will be called
 */
function addEventHandlers() {
    // handling search icon click event
    document.getElementById("searchIconDiv").addEventListener("click", searchHandler);

    // handling enter key press on search bar
    document.getElementById("searchBar").addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            searchHandler();
        }
    });
}

/**
 * Remove all the elements from "movieCards" section
 */
function clearPreviousResult() {
    const nodes = document.getElementById("movieCards").childNodes;
    console.log(`clearPreviousResult: ${nodes.length}`);
    for (var i = nodes.length; i >= 0; i--) {
        console.log("deleting node")
        nodes[i]?.remove();
    }
}

/**
 * Creates a new HTML element with optional classes and text content.
 *
 * @param {string} elementName - The tag name of the HTML element to create (e.g., 'div', 'p', 'img', 'h2').
 * @param {string[]} [classNames=[]] - An optional array of class names to add to the element.
 * @param {string} [contentText=''] - An optional string of text content to set for the element.
 * Note: For elements like 'img', 'input', etc., this will be ignored.
 * @returns {HTMLElement} The newly created HTML element.
 */
function createHtmlElement(elementName, classNames = [], contentText = '') {
    console.log(`CreateHtmlElement: ${elementName}`);
    // step 1: Create the html element
    const htmlElment = document.createElement(elementName);
    // step 2: add classes to the element
    classNames.forEach(className => htmlElment.classList.add(className));
    // step 3: add the content
    htmlElment.innerHTML = contentText;
    return htmlElment;
}


/**
 * Perform a fetch operation to OMDB API to get list of movies based on movieTitle user provided
 * 
 * @param {string} movieTitle - String user entered in the search bar.
 */
async function getMovies(movieTitle) {

    const API_URL = `${BASE_URL}/?apikey=${myApiKey}&s=${movieTitle}`;

    try {
        const response = await fetch(API_URL);

        if (response.ok) {

            // Success response is received. Extracting movieList from response.
            const data = await response.json();

            const movieList = data.Search;

            if (movieList == null || movieList.length == 0) {
                createEmptyView();
                return;
            }

            // check the Poster URL, if poster url is not correct, do not create movie card.
            const moviePromises = movieList.map(movie => checkPosterURL(movie));

            // wait for all the promise to be settled.
            const results = await Promise.allSettled(moviePromises);

            const filteredMovies = [];
            results.forEach(result => {
                if (result.status === "fulfilled" && result.value != null) {
                    const movieObj = result.value;
                    movieObj.Title = movieObj.Title.length > 40 ? `${movieObj.Title.substring(0, 40)}...` : movieObj.Title;
                    filteredMovies.push(movieObj);
                }
            })

            console.log("Final movie list: ");
            console.log(filteredMovies)

            /**
             * TASK : 1
             * if filteredMovies.length == 0, call createEmptyView() method.
             * Else write a for loop which will iterator over filteredMovies array 
             * and call createMovieCard() for each movie object in this array.
             */

            if (filteredMovies.lentth == 0) {
                createEmptyView();
                return 0;
            } else {
                for (var idx = 0; idx < filteredMovies.length; idx++) {
                    createMovieCard(filteredMovies[idx]);
                }
            }

        }
    } catch (exception) {
        console.error("Exception occurred in getMovies function.")
        console.error(exception);

    }
}

/**
 * Check the url of movie poster. If poster url is working then only we will create movie card.
 * 
 * @param {object} movie - The movie object from the list of movies received from OMDB API.
 * @returns {object || null} movie object if the poster url is working, null if poster url is not working
 */
async function checkPosterURL(movie) {
    try {
        const response = await fetch(movie.Poster)
        if (response.ok) {
            // Poster url is working
            return movie;
        } else {
            // Poster url is not correct
            return null;
        }
    } catch (error) {
        console.error("Error while checking poster url");
        console.error(error);
    }
}

/**
 * If the search operation does not create any movie card, call this method to create empty view. 
 * Create a "p" element and append it to "movieCards" section. The structure of p element is given below.
 * 
 *      <p class="noresult">No movie found!!! Please search for another title.</p>
 */
function createEmptyView() {
    console.log("createEmptyView");

    /**
     * TASK : 2
     * Create empty view and append it to "movieCards" section.
     */
    const MovieElement_p = document.createElement('p')
    MovieElement_p.classList.add('noresult')
    MovieElement_p.innerHTML = "No movie found!!! Please search for another title."

    document.getElementById("movieCards").appendChild(MovieElement_p);
}

/**
 * Create a movie card using the parameter. The card should have movie title and poster. The card should follow below structure:
 *      <article class="card">
 *          <p class="cardTitle">movie.Title</p>
 *          <div class="cardPosterDiv">
 *              <img class="moviePoster" src=movie.Poster alt="Movie poster">
 *          </div>
 *      </article>
 * 
 * @param {object} movie - The movie object from filteredMovie. The movie object will have a Title and a Poster url.
 */
function createMovieCard(movie) {
    console.log("createMovieCard");
    console.log(movie);

    /**
     * TASK : 3
     * Create Movie Card and append it "movieCards" section.
     */
    const MovieElement_img = document.createElement("img");
    MovieElement_img.classList.add("moviePoster");
    MovieElement_img.src = movie.Poster;
    MovieElement_img.alt = "Movie poster";

    const MovieElement_p = document.createElement("p");
    MovieElement_p.classList.add("cardTitle");
    MovieElement_p.innerHTML = movie.Title;

    const MovieElement_div = document.createElement("div");
    MovieElement_div.classList.add("cardPosterDiv");

    const MovieElement_article = document.createElement("article");
    MovieElement_article.classList.add("card");

    MovieElement_div.appendChild(MovieElement_img);
    MovieElement_article.appendChild(MovieElement_p);
    MovieElement_article.appendChild(MovieElement_div);

    document.getElementById("movieCards").appendChild(MovieElement_article);

}