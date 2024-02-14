/*
Yritin saada pilkottua skriptiä kahteen, mutta siitä syntyi muna-kana ongelma, jota en vain saanut toimimaan.
Tämä on nyt lätkitty yhteen megaskriptiin, koska asynkronisten funktioiden takia se ei vaan toiminut.
*/

//
// VARIABLES
let TMDB_RAT = ""
let RATJson = {}
let releaseYear
let posterPath
const loadingPicture = "./img/loadDummy.jpg"
const imageHandle = document.querySelector("#imageContainer img")
const guessInputBox = document.querySelector("#guessInputField")
const imageUrlBase = "https://image.tmdb.org/t/p/w1280"


//
// DOMCONTENTLOADED
document.addEventListener("DOMContentLoaded", async () => {
	guessInputBox.style.display = "none"
	resetImage()
	await loadAPIKEY()
	await testApiKeyWorks()
	testStorageSupport()
	await gameLoop()
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

// Ladataan tiedostosta API-avain >> Ei kovakoodausta niin ei mene vahingossa gittiin
// Ei toiminu ilman await avainsanaa => odottaa, että komento toteutetaan
const loadAPIKEY = async () => {
	try {
		const tiedosto = await fetch("apikey.txt")
		// ok on status koodi. Voi olla mitä vain välillä 200-299
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

// Näköjään melkein kaikki funktiot ja muuttujat pitää olla async tai muuten menee rikki
const testApiKeyWorks = async () => {
	try {
		RATJson = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer ' + TMDB_RAT
			}
		}
		// Pyyntö serverille, testaa onko API-avain oikea
		const response = await fetch('https://api.themoviedb.org/3/authentication', RATJson);
		// ok on status koodi. Voi olla mitä vain välillä 200-299
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

// Jatkuvia ongelmia asynkronisten funktioiden kanssa..
// En saanu muuten toimimaan yksinään..
// const runTests = async () => {
// 	await loadAPIKEY()
// 	await testApiKeyWorks()
// 	checkStorageSupport()
// }

const resetImage = () => {
	// Initial load, dummy image
	imageHandle.src = loadingPicture
}

const loadMovie = async (movieID) => {
	await fetch("https://api.themoviedb.org/3/movie/" + movieID + "?language=en-US", RATJson)
		.then(response => response.json())
		// .then(response => console.log(response["release_date"]))
		// TODO: Check if exists
		// TODO: Check for adult, release_date, poster_path
		.then(response => {
			releaseYear = response.release_date.substring(0, 4)
			posterPath = response.poster_path
		})
		.catch(err => console.error(err))
}

const loadImage = () => {
	imageHandle.src = imageUrlBase + posterPath
}

const handleAnswer = () => {

	//
	// TODO: Handle correct/incorrect
	if (guessCorrect()) {
		console.log("correct!")
	}
	else {
		console.log("yeas was " + releaseYear)
	}
	//
	// TODO: add stats
	//
	// TODO: run correct/incorrect status update
	imageHandle.src = loadingPicture
	guessInputBox.value = ""
	gameLoop()
}

const guessCorrect = () => {
	// This had a 10 line try-catch block, but it seems this does the same job
	// I could not get it to throw an error with any input..
	return Number(guessInputBox.value) === Number(releaseYear)
}

const gameLoop = async () => {
	// TODO: Random movie ID for loadMovie()
	await loadMovie(348)
	loadImage()
	guessInputBox.style.display = "block"
	guessInputBox.focus()
}