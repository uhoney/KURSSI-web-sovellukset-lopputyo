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
let latestID
const loadingPicture = "./img/loadDummy.jpg"
const imageHandle = document.querySelector("#imageContainer img")
const guessInputBox = document.querySelector("#guessInputField")
const imageUrlBase = "https://image.tmdb.org/t/p/w1280"



//
// DOMCONTENTLOADED
document.addEventListener("DOMContentLoaded", async () => {
	resetImage()
	// testStorageSupport()
	checkAndCreateStorage()
	await loadAPIKEY()
	await testApiKeyWorks()
	await getLatestID()
	resetImage()
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
const checkAndCreateStorage = () => {
	if (localStorage.getItem("guessTotal") === null) {
		localStorage.setItem("guessTotal", Number(0))
	}
	if (localStorage.getItem("guessCorrect") === null) {
		localStorage.setItem("guessCorrect", Number(0))
	}
	if (localStorage.getItem("guessIncorrect") === null) {
		localStorage.setItem("guessIncorrect", Number(0))
	}
}


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

const getLatestID = async () => {
	await fetch('https://api.themoviedb.org/3/movie/latest', RATJson)
		.then(response => response.json())
		.then(response => {
			latestID = Number(response.id)
		})
		.catch(err => console.error(err));
}

const loadMovie = async () => {
	while (true) {
		try {
			console.log("fetching new movie..")
			const response = await fetch("https://api.themoviedb.org/3/movie/" + getRandomID() + "?language=en-US", RATJson)
			if (!response.ok) {
				throw new Error("something went wrong")
			}
			const data = await response.json()
			if (checkIfValidKey(data, "release_date") &&
				checkIfValidKey(data, "poster_path") &&
				data["adult"] === false) {
				releaseYear = data.release_date.substring(0, 4)
				posterPath = data.poster_path
				break
			}
		} catch (err) {
			console.error(err);
		}

		await new Promise(resolve => setTimeout(resolve, 1000)) // Delay for 1 second
	}
}


// const loadMovie = async () => {
// 	while (true) {
// 		// await fetch("https://api.themoviedb.org/3/movie/348" + "?language=en-US", RATJson)
// 		await fetch("https://api.themoviedb.org/3/movie/" + getRandomID() + "?language=en-US", RATJson)
// 			.then(response => response.json())
// 			.then(response => {
// 				if (checkIfValidKey(response, "release_date") &&
// 					checkIfValidKey(response, "poster_path") &&
// 					response["adult"] === false) {
// 					releaseYear = response.release_date.substring(0, 4)
// 					posterPath = response.poster_path
// 					break
// 				}
// 				else {
// 					continue
// 				}
// 			})
// 			.catch(err => {
// 				console.error(err)
// 			})
// 	}
// }

const checkIfValidKey = (movie, key) => (
	movie.hasOwnProperty(key) &&
	movie[key] !== null &&
	movie[key] !== undefined &&
	movie[key] !== ""
)


const loadImage = () => {
	imageHandle.src = imageUrlBase + posterPath
}

const addToStorageValue = (storageValue) => {
	let tmp = localStorage.getItem(storageValue)
	tmp = Number(tmp) + 1
	localStorage.setItem(storageValue, tmp)
}

const handleAnswer = () => {
	if (guessCorrect()) {
		console.log("Correct!")
		addToStorageValue("guessCorrect")
	}
	else {
		console.log("Incorrect. The year was " + releaseYear)
		addToStorageValue("guessIncorrect")
	}
	addToStorageValue("guessTotal")

	imageHandle.src = loadingPicture
	guessInputBox.value = ""
	guessInputBox.style.display = "none"
	gameLoop()
}

const getRandomID = () => {
	return Math.floor(Math.random() * (latestID + 1))
}

const guessCorrect = () => {
	// This had a 10 line try-catch block, but it seems this does the same job
	// I could not get it to throw an error with any input..
	return Number(guessInputBox.value) === Number(releaseYear)
}

const gameLoop = async () => {
	// guessInputBox.style.display = "none"

	await loadMovie()
	loadImage()
	guessInputBox.style.display = "block"
	guessInputBox.focus()
}