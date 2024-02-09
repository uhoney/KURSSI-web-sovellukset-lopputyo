

// ReadAccessToken
let TMDB_RAT = ""

// Näköjään JOKAIKINEN funktio pitää olla async tai kaikki menee rikki
const testApiKeyWorks = async () => {
	try {
		// Ladataan tiedostosta API-avain >> Ei kovakoodausta ja vahingossa mene gittiin
		const tiedosto = await fetch("apikey.txt")
		TMDB_RAT = (await tiedosto.text()).trim()

		// JSON objekti, RAT lähetetään pyynnön mukana
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer ' + TMDB_RAT
			}
		}

		// Pyyntö serverille, testaa onko API-avain oikea
		// Palautetaan true/false
		const response = await fetch('https://api.themoviedb.org/3/authentication', options);
		if (!response.ok) {
			throw new Error();
		}
		return true
	} catch (err) {
		return false
	}
}

testApiKeyWorks()
	// testApiKeyWorks on asynkroninen funktio.
	// .then odottaa vastausta testApiKeyWorks() funktiolta. Eli tuo asynkroninen funktio ajetaan 'loppuun asti'
	// ja sitten vasta .then jatkaa eteenpäin kun on saanut vastauksen
	.then(result => {
		avaimetOk = result
		console.log("apikey ok: " + avaimetOk)
	})
	.catch(error => {
		console.error(error)
	})