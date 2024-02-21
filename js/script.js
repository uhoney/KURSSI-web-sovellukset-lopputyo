//
// VARIABLES
let TMDB_RAT = ""
let RATJson = {}
let releaseYear
let posterPath
let latestID
const loadingPicture = "./img/loaddummy.jpg"
const imageHandle = document.querySelector("#imageContainer img")
const guessInputBox = document.querySelector("#guessInputField")
const imageUrlBase = "https://image.tmdb.org/t/p/w1280"
const showAnswer = document.querySelector("#showAnswer")

//
// DOMCONTENTLOADED
// A few test functions for apikeys and browser storage.
document.addEventListener("DOMContentLoaded", async () => {
	resetImage()
	testStorageSupport()
	checkAndCreateStorage()
	await loadAPIKEY()
	await testApiKeyWorks()
	await getLatestID()
	await loadLoop()
})

//
// EVENT LISTENERS
guessInputBox.addEventListener("keydown", (press) => {
	if (press.keyCode === 13) {
		handleAnswer()
	}
})

//
// FUNCTIONS

// Create new variables for storage if not exist already
const checkAndCreateStorage = () => {
	if (localStorage.getItem("guessTotal") === null) {
		localStorage.setItem("guessTotal", "0")
	}
	if (localStorage.getItem("guessCorrect") === null) {
		localStorage.setItem("guessCorrect", "0")
	}
	if (localStorage.getItem("guessIncorrect") === null) {
		localStorage.setItem("guessIncorrect", "0")
	}
}


// Load API-key from .txt file >> No hardcoding and accidentally post on git
// Issues with asynchronous functions
const loadAPIKEY = async () => {
	try {
		const tiedosto = await fetch("apikey.txt")
		// OK statuscode, can be anything from 200-299
		if (!tiedosto.ok) {
			throw new Error("ERR:: apikey.txt not found")
		}
		else {
			TMDB_RAT = (await tiedosto.text()).trim()
		}
		// console.log("OK:: API-key read!")
	}
	catch (error) {
		console.error(error.message)
	}
}

// One async apparently forces every function to async
// Could not get it to work without async everywhere
// Function runs a test on server for a valid API-key
const testApiKeyWorks = async () => {
	try {
		RATJson = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer ' + TMDB_RAT
			}
		}
		const response = await fetch('https://api.themoviedb.org/3/authentication', RATJson);
		if (!response.ok) {
			throw new Error()
		}
		// console.log("OK:: API-key accepted!")
	} catch (err) {
		console.log("ERR:: API-key missing or failed")
	}
}

const testStorageSupport = () => {
	if (typeof (Storage) !== "undefined") {
		// console.log("OK:: Browser storage supported!")
	}
	else {
		console.log("ERR:: Browser storage not supported.")
	}
}

const resetImage = () => {
	// Initial load, dummy image
	imageHandle.src = loadingPicture
}

// TMDB developers suggestion to get num of movies in database
// WARN:: a movie ID is NOT guaranteed to be populated
const getLatestID = async () => {
	await fetch('https://api.themoviedb.org/3/movie/latest', RATJson)
		.then(response => response.json())
		.then(response => {
			latestID = Number(response.id)
		})
		.catch(err => console.error(err));
}

// Loads a random movie.
// Run in a loop with 1sec delay on fetch until found a valid ID && valid properties
const loadMovie = async () => {
	while (true) {
		try {
			const response = await fetch("https://api.themoviedb.org/3/movie/" + getRandomID(), RATJson)
			// ID might not be populated == no entry on ID
			if (!response.ok) {
				throw new Error()
			}
			const data = await response.json()
			// Run checks if movie is valid == has wanted properties
			if (checkIfValidKey(data, "release_date") &&
				checkIfValidKey(data, "poster_path") &&
				data["adult"] === false) {
				releaseYear = data.release_date.substring(0, 4)
				posterPath = data.poster_path
				break
			}
		} catch (err) {
			console.log("ERR:: No entry for this ID")
		}

		console.log("Conditions not met, fetching new movie..")

		await new Promise(resolve => setTimeout(resolve, 1000)) // Delay for 1 second
	}
}

// Check if parameter JSON contains wanted key and populated, return boolean
const checkIfValidKey = (movie, key) => (
	movie.hasOwnProperty(key) &&
	movie[key] !== null &&
	movie[key] !== undefined &&
	movie[key] !== ""
)

// Change src of html element
const loadImage = () => {
	imageHandle.src = imageUrlBase + posterPath
}

// Add +1 to parameter value in storage, handles all storage values
const addToStorageValue = (storageValue) => {
	let tmp = localStorage.getItem(storageValue)
	tmp = Number(tmp) + 1
	localStorage.setItem(storageValue, tmp)
}

const showAnswerResponse = (answer) => {
	if (answer) {
		showAnswer.textContent = "CORRECT!"
	}
	else {
		showAnswer.textContent = "Nope.. It's " + releaseYear
	}
	setTimeout(() => {
		showAnswer.textContent = ""
	}, 2000)
}

// Handles stats for game, prints answer to user
const handleAnswer = () => {
	if (guessCorrect()) {
		addToStorageValue("guessCorrect")
		showAnswerResponse(guessCorrect())
	}
	else {
		addToStorageValue("guessIncorrect")
		showAnswerResponse(guessCorrect())
	}
	addToStorageValue("guessTotal")

	loadLoop()
}

const getRandomID = () => {
	return Math.floor(Math.random() * (latestID + 1))
}

// Returns boolean, suprisingly catches invalid inputs as false
const guessCorrect = () => {
	return Number(guessInputBox.value) === Number(releaseYear)
}

// "gameLoop" but not really
const loadLoop = async () => {
	guessInputBox.style.display = "none"
	imageHandle.src = loadingPicture
	guessInputBox.value = ""
	await loadMovie()
	loadImage()
	guessInputBox.style.display = "block"
	guessInputBox.focus()
}