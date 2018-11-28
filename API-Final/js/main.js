/*BRINDA DHIREN SHAH
27th NOVEMBER 2018
*/


/* globals APIKEY*/
let MyAPI_Project = (function () { // declaring an iife

    const movieDataBaseURL = "https://api.themoviedb.org/3/";
    let imageURL = null;
    let imageSizes = [];


    let Showlist = null;
    let searchString = "";
    let imageURLKey = "imageURL";
    let pages = [];
    let timeKey = "timeKey";
    let imageSizeKey = "imageSize";
    let modeKey = "modeKey";
    //    let TVmode = "TVmodeKey";
    let staleDataTimeOut = "3600";
    let modes = null;
    let h3 = null;

    document.addEventListener("DOMContentLoaded", init);

    function init() {

        pages = document.querySelectorAll(".page");
        console.log(pages);
        //console.log(APIKEY);
        addEventListeners();

        h3 = document.getElementById("elapsedTime");

        getDataFromLocalStorage();
        getPosterURLAndSizes();

    }

    function addEventListeners() {

        let searchButton = document.querySelector(".magnifyDiv");

        searchButton.addEventListener("click", startSearch);
        document.querySelector("#search-input").addEventListener("keyup", function (e) {

            if (e.keyCode == 13) {

                startSearch();
            }
        });

        document.querySelector(".btncancel").addEventListener("click", hideOverlay);
        document.querySelector(".searchButtonDiv").addEventListener("click", showOverlay);

        document.querySelector(".Backbutton").addEventListener("click", PageBack);
        document.querySelector(".btnsave").addEventListener("click", function (e) {
            let TVshow = document.getElementsByName("show");
            for (let i = 0; i < TVshow.length; i++) {
                if (TVshow[i].checked) {
                    Showlist = TVshow[i].value;
                    break;
                }
            }

            let p = document.querySelector(".list");
            p.innerHTML = "";
            let h1 = document.createElement("h1");
            h1.innerHTML = Showlist + " Recommendation";
            modes = Showlist;
            console.log(modes);
            console.log("Saved mode in local Storage");
            localStorage.setItem(modeKey, JSON.stringify(Showlist.value));
            console.log(Showlist);
            h1.style.fontFamily = "serif";
            p.appendChild(h1);
            hideOverlay(e);
        });

    }

    function showOverlay(e) {
        e.preventDefault();
        let overlay = document.querySelector(".overlay");
        overlay.classList.add("show");
        overlay.classList.remove("hide");
        showmodal(e);
    }

    function showmodal(e) {

        e.preventDefault();
        let modal = document.querySelector(".modal");
        modal.classList.add("on");
        modal.classList.remove("off");
    }

    function hideOverlay(e) {
        e.preventDefault();
        let overlay = document.querySelector(".overlay");
        overlay.classList.add("hide");
        overlay.classList.remove("show");
        HideModal(e);
    }

    function HideModal(e) {
        e.preventDefault();
        e.stopPropagation(); // do not allow click to pass through
        let modal = document.querySelector(".modal");
        modal.classList.add("off");
        modal.classList.remove("on");
    }


    function getDataFromLocalStorage() {

        // check if image secure base url and sizes array are saved in local storage , if not call getPosterURLAndSizes()

        if (localStorage.getItem(imageURLKey) && localStorage.getItem(imageSizeKey)) {
            console.log("Data retrieved from local Storage");
            imageURL = localStorage.getItem(modeKey);
            imageSizes = localStorage.getItem(imageSizeKey);

            console.log(imageURL);
            console.log(imageSizes);
        } else {
            console.log("Data is not saved on local Storage");
        }

        if (localStorage.getItem(modeKey)) {
            console.log("Mode Data Retrieved from local Storage");
            Showlist = localStorage.getItem(modeKey);
            console.log(Showlist.value);

            let p = document.querySelector(".list");
            p.innerHTML = "";
            let h1 = document.createElement("h1");
            h1.innerHTML = Showlist + " Recommendation";
            h1.className = "header";
            h1.style.fontFamily = "serif";
            p.appendChild(h1);
        }

        //if in local storage check if saved over 60 minutes ago, if true then call getPosterURLAndSizes() 


        //in local storage AND <60 minutes old, load and use from local storage

        // First see if the key exists in local storage
        if (localStorage.getItem(timeKey)) {
            console.log("Retrieving Saved Date from Local Storage");
            let savedDate = localStorage.getItem(timeKey); // get the saved date sting
            savedDate = new Date(savedDate); // use this string to initialize a new Date object
            console.log(savedDate);

            let seconds = calculateElapsedTime(savedDate);


            if (seconds > staleDataTimeOut) {
                console.log("Local Storage Data is stale");
                //                            h3.innerHTML += "<br>Local Storage Data is stale";
                saveDateToLocalStorage();
                getPosterURLAndSizes();

            }
        } else {
            saveDateToLocalStorage();
            getPosterURLAndSizes();

        }
    }


    function saveDateToLocalStorage() {
        console.log("Saving current Date to Local Storage");
        //        h3.innerHTML += "<br>Saving current Date to Local Storage";
        let now = new Date();
        localStorage.setItem(timeKey, now);
    }

    function calculateElapsedTime(savedDate) {
        let now = new Date(); // get the current time
        console.log(now);

        // calculate elapsed time
        let elapsedTime = now.getTime() - savedDate.getTime(); // this in milliseconds

        let seconds = Math.ceil(elapsedTime / 1000);
        console.log("Elapsed Time: " + seconds + " seconds");
        return seconds;
    }


    function getPosterURLAndSizes() {

        // https://api.themoviedb.org/3/configuration?api_key=<<api_key>>

        let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;

        fetch(url).then(function (response) {

                return response.json();
            })

            .then(function (data) {

                console.log(data);
                imageURL = data.images.secure_base_url;
                imageSizes = data.images.poster_sizes;

                localStorage.setItem(imageURLKey, JSON.stringify(imageURL.value));
                localStorage.setItem(imageSizeKey, JSON.stringify(imageSizes));
                console.log("Data saved in local Storage");
                console.log(imageURL);
                console.log(imageSizes);
            })
            .catch(function (error) {

                console.log(error);
            })
    }

    function startSearch() {

        let search = document.getElementById("search-input");
        search.style.width = "800px";
        let main = document.querySelector("main");
        main.style.transform = "translateY(-240px)";
        main.style.transition = "transform 1s";
        console.log("start search");

        modes = Showlist;
        console.log(modes);
        searchString = document.getElementById("search-input").value;

        if (!searchString) {
            alert("Please enter search data");

            document.getElementById("search-input").focus;
            return;
        }

        // this is a new search so you should reset any existing page data

        //        getSearchResults();
        else {

            if (modes == "Movie") {
                let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;
                fetch(url)
                    .then((response) => response.json())
                    .then(function (data) {
                        console.log(data);

                        createPage(data, "#search-results");

                    })
                    .catch((error) => alert(error));
            } else {
                let url = `${movieDataBaseURL}search/tv?api_key=${APIKEY}&query=${searchString}`;
                fetch(url)
                    .then((response) => response.json())
                    .then(function (data) {
                        console.log(data);

                        createPage(data, "#search-results");

                    })
                    .catch((error) => alert(error));
            }
        }
    }


    function createPage(data, pageid) {

        let content = document.querySelector(pageid + ">.content");
        let title = document.querySelector(pageid + ">.title");

        let message = document.createElement("h2");
        content.innerHTML = "";
        title.innerHTML = "";

        if (data.total_results == 0) {

            message.innerHTML = `No results found for ${searchString}`;
        }
        if (pageid == "#search-results") {

            message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> Page include 1 to ${data.results.length}`;

            message.style.color = "blue";
            message.style.fontSize = "3rem";
            title.appendChild(message);

            let documentFragment = new DocumentFragment();

            documentFragment.appendChild(createMovieCards(data.results));

            content.appendChild(documentFragment);
        } else if (pageid == "#recommend-results") {
            message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> 1 to ${data.results.length} Recommendation show below :`;
            message.style.color = "blue";
            message.style.fontSize = "3rem";
            title.appendChild(message);
            let documentFragment = new DocumentFragment();
            documentFragment.appendChild(CreateRecommendationCard(data.results));

            content.appendChild(documentFragment);

        }
        let cardList = document.querySelectorAll(".content>div");

        cardList.forEach(function (item) {
            item.addEventListener("click", getRecommendations);
        });

    }


    function createTelevisionPages(data, pageid) {
        let content = document.querySelector(pageid + ">.content");

        let title = document.querySelector(pageid + ">.title");

        let message = document.createElement("h2");
        content.innerHTML = "";
        title.innerHTML = "";

        if (data.total_results == 0) {
            message.innerHTML = `No data Found ${searchString}`;
        }
        if (pageid == "#search-results") {
            message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> Page include 1 to ${data.results.length}`;
            message.style.color = "blue";
            message.style.fontSize = "3rem";
            title.appendChild(message);
            let documentFragment = new DocumentFragment();
            documentFragment.appendChild(createTelevisionCards(data.results));

            content.appendChild(documentFragment);

        } else if (pageid == "#recommend-results") {
            message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> 1 to ${data.results.length} Recommendation show below :`;
            message.style.color = "blue";
            message.style.fontSize = "3rem";
            title.appendChild(message);
            let documentFragment = new DocumentFragment();
            documentFragment.appendChild(createTelevisionRecommendationCards(data.results));

            content.appendChild(documentFragment);

        }

        let cardList = document.querySelectorAll(".content>div");
        cardList.forEach(function (item) {
            item.addEventListener("click", getTelevisionRecommendation);
        });
    }

    function createTelevisionCards(results) {

        let documentFragment = new DocumentFragment();
        results.forEach(function (TV) {

            let movieCard = document.createElement("div");
            let section = document.createElement("section");
            let image = document.createElement("img");
            let Title = document.createElement("h3");
            let release_date = document.createElement("h4");
            let review = document.createElement("h5");
            let overview = document.createElement("p");

            Title.textContent = TV.title;
            release_date.textContent = TV.release_date;
            review.textContent = TV.vote_average;
            overview.textContent = TV.overview;

            image.src = `${imageURL}${imageSizes[2]}${TV.poster_path}`;

            movieCard.setAttribute("data-title", TV.title);
            movieCard.setAttribute("data-id", TV.id);

            movieCard.className = "movieCard";
            section.className = "imageSection";

            section.appendChild(image);

            movieCard.appendChild(section);
            movieCard.appendChild(Title);
            movieCard.appendChild(release_date);
            movieCard.appendChild(review);
            movieCard.appendChild(overview);

            documentFragment.appendChild(movieCard);
            navigate(0);

        });
        return documentFragment;
    }

    function createMovieCards(results) {

        let documentFragment = new DocumentFragment(); // use a documentFragment for performance

        results.forEach(function (movie) {


            let movieCard = document.createElement("div");
            let section = document.createElement("section");
            let image = document.createElement("img");
            let videoTitle = document.createElement("h3");
            let videoDate = document.createElement("h4");
            let videoRating = document.createElement("h5");
            let videoOverview = document.createElement("p");


            // set up the content
            videoTitle.textContent = movie.title;
            videoDate.textContent = movie.release_date;
            videoRating.textContent = movie.vote_average;
            videoOverview.textContent = movie.overview;


            // set up image source URL
            image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;
            // set up movie data attributes
            movieCard.setAttribute("data-title", movie.title);
            movieCard.setAttribute("data-id", movie.id);


            // set up class names
            movieCard.className = "movieCard";
            section.className = "imageSection";

            // append elements
            section.appendChild(image);
            movieCard.appendChild(section);
            movieCard.appendChild(videoTitle);
            movieCard.appendChild(videoDate);
            movieCard.appendChild(videoRating);
            movieCard.appendChild(videoOverview);

            documentFragment.appendChild(movieCard);
            navigate(0);
            image.setAttribute("alt", "image not found");



        });
        return documentFragment;
    }

    function createTelevisionRecommendationCards(results) {
        let documentFragment = new DocumentFragment();

        results.forEach(function (TV) {

            let movieCard = document.createElement("div");
            let section = document.createElement("section");
            let image = document.createElement("img");
            let Title = document.createElement("h3");
            let release_date = document.createElement("h4");
            let review = document.createElement("h5");
            let overview = document.createElement("p");

            Title.textContent = TV.title;
            release_date.textContent = TV.release_date;
            review.textContent = TV.vote_average;
            overview.textContent = TV.overview;

            image.src = `${imageURL}${imageSizes[2]}${TV.poster_path}`;

            movieCard.setAttribute("data-title", TV.title);
            movieCard.setAttribute("data-id", TV.id);

            movieCard.className = "movieCard";
            section.className = "imageSection";

            section.appendChild(image);

            movieCard.appendChild(section);
            movieCard.appendChild(Title);
            movieCard.appendChild(release_date);
            movieCard.appendChild(review);
            movieCard.appendChild(overview);

            documentFragment.appendChild(movieCard);
            navigate(1);


        });
        return documentFragment;
    }

    function CreateRecommendationCard(results) {

        let documentFragment = new DocumentFragment();

        results.forEach(function (movie) {

            let movieCard = document.createElement("div");
            let section = document.createElement("section");
            let image = document.createElement("img");
            let Title = document.createElement("h3");
            let release_date = document.createElement("h4");
            let review = document.createElement("h5");
            let overview = document.createElement("p");

            Title.textContent = movie.original_title;
            release_date.textContent = movie.release_date;
            review.textContent = movie.vote_average;
            overview.textContent = movie.overview;

            image.src = `${imageURL}${imageSizes[2]}${movie.poster_path}`;

            movieCard.setAttribute("data-title", movie.title);
            movieCard.setAttribute("data-id", movie.id);

            movieCard.className = "movieCard";
            section.className = "imageSection";

            section.appendChild(image);
            movieCard.appendChild(section);
            image.setAttribute("alt", "Image not found");
            movieCard.appendChild(Title);
            movieCard.appendChild(release_date);
            movieCard.appendChild(review);
            movieCard.appendChild(overview);

            documentFragment.appendChild(movieCard);
            navigate(1);
        });
        return documentFragment;
    }


    function getRecommendations() {
        // console.log(this);
        let movieTitle = this.getAttribute("data-title");



        let movieID = this.getAttribute("data-id");
        console.log("you clicked: " + movieTitle + " " + movieID);


        let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`;
        searchString = movieTitle;

        console.log(searchString);
        document.querySelector("#search-input").value = searchString;

        fetch(url)

            .then((response) =>
                response.json())

            .then(function (data) {

                console.log(data);

                createPage(data, "#recommend-results");
            })
            .catch((error) => console.log(error));
        //                    navigate(1);
    }

    function getTelevisionRecommendation() {

        let TV_Title = this.getAttribute("data-title");
        let TV_ID = this.getAttribute("data-id");
        let url = `${movieDataBaseURL}tv/${TV_ID}/recommendations?api_key=${APIKEY}`;
        searchString = TV_Title;
        console.log(searchString);
        document.querySelector("#search-input").value = searchString;
        fetch(url)
            .then((response) => response.json())
            .then(function (data) {
                console.log(data);
                createTelevisionPages(data, "#recommend-results");
            })
            .catch((error) => alert(error));
    }

    function PageBack() {
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].classList.contains("active")) {
                let cl = pages[i].id;
                let active = document.getElementById(cl);
                if (cl == "recommend-results") {
                    active.classList.remove("active");
                    document.querySelector("#search-results").classList.add("active");

                } else if (cl == "search-results") {
                    active.classList.remove("active");
                    document.querySelector("#search-results").classList.remove("active");
                    let search = document.getElementById("search-input");
                    search.style.width = "800px";
                    let main = document.querySelector("main");
                    main.style.transform = "translateY(0)";
                    main.style.transition = "transform 1s";
                    document.getElementById("search-input").value = "";
                }
            }
        }
    }
    let navigate = function (page) {
        for (let i = 0; i < pages.length; i++) {
            if (page == i) {
                pages[i].classList.add("active");
            } else {
                pages[i].classList.remove('active');
            }
        }
    }

})(); // closing the iife, note the extra ()
