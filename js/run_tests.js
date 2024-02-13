// ReadAccessToken
let TMDB_RAT = ""

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
	}
	catch (error) {
		console.error(error.message)
	}
}

// Näköjään melkein kaikki funktiot ja muuttujat pitää olla async tai muuten menee rikki
const testApiKeyWorks = async () => {
	// JSON objekti, RAT lähetetään pyynnön mukana
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer ' + TMDB_RAT
		}
	}

	try {
		// Pyyntö serverille, testaa onko API-avain oikea
		const response = await fetch('https://api.themoviedb.org/3/authentication', options);
		// ok on status koodi. Voi olla mitä vain välillä 200-299
		if (!response.ok) {
			throw new Error()
		}
		console.log("OK:: API-key accepted!")
	} catch (err) {
		console.log("ERR:: API-key missing or failed")
	}
}

const checkStorageSupport = () => {
	if (typeof (Storage) !== "undefined") {
		console.log("OK:: Browser storage supported!")
	}
	else {
		console.log("ERR:: Browser storage not supported.")
	}
}

// Jatkuvia ongelmia asynkronisten funktioiden kanssa..
// En saanu muuten toimimaan yksinään..
const runTests = async () => {
	await loadAPIKEY()
	await testApiKeyWorks()
	checkStorageSupport()
}

//
// Täällä vasta ajetaan skripti
runTests()