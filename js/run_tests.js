// ReadAccessToken
let TMDB_RAT = ""

try {
	// Ladataan tiedostosta API-avain >> Ei kovakoodausta niin ei mene vahingossa gittiin
	// Ei toiminu ilman await avainsanaa => odottaa, että komento toteutetaan
	const tiedosto = await fetch("apikey.txt")
	// ok on status koodi. Voi olla mitä vain välillä 200-299
	if (!tiedosto.ok) {
		throw new Error("ERR:: Tiedostoa ei löydy!")
	}
	else {
		TMDB_RAT = (await tiedosto.text()).trim()
	}
}
catch (error) {
	console.error(error.message)
}

// JSON objekti, RAT lähetetään pyynnön mukana
const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer ' + TMDB_RAT
	}
}

// Näköjään melkein kaikki funktiot ja muuttujat pitää olla async tai muuten menee rikki
const testApiKeyWorks = async () => {
	try {
		// Pyyntö serverille, testaa onko API-avain oikea
		const response = await fetch('https://api.themoviedb.org/3/authentication', options);
		// ok on status koodi. Voi olla mitä vain välillä 200-299
		if (!response.ok) {
			throw new Error()
		}
		console.log("OK:: API-key accepted")
	} catch (err) {
		console.log("ERR:: API-key missing or failed")
	}
}

// DEBUG:: TESTAA API-AVAIN
// testApiKeyWorks()