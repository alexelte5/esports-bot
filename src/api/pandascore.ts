export async function fetchPastMatches(): Promise<any> {
	const url = "https://api.pandascore.co/lol/matches?filter[status]=finished";

	try {
		if (!process.env.PANDASCORE_TOKEN) {
			throw new Error(
				"PANDASCORE_TOKEN ist nicht definiert. Wurde dotenv geladen?",
			);
		}

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${process.env.PANDASCORE_TOKEN}`,
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`API Fehler: ${response.status} - ${response.statusText}`,
			);
		}

		console.log("[PandaScoreAPI] New matches found");
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(
			"[PandaScoreAPI] Fehler beim Abrufen der Pandascore Matches:",
			error,
		);
		return null;
	}
}

export async function validLeagues(): Promise<any> {
	const validLeague = [];
	try {
		const postMatches = await fetchPastMatches();
		for (const match of postMatches) {
			const targets = [
				"lec",
				"lck",
				"lpl",
				"lcs",
				"worlds",
				"msi",
				"first-stand",
				"ewc",
				"world-cup",
				"mid-season-invitational",
			];
			const leagueName = match.league.name.toLowerCase();
			const leagueSlug = match.league.slug.toLowerCase();

			const isTargetMatch = targets.some(
				(key) => leagueName.includes(key) || leagueSlug.includes(key),
			);

			if (isTargetMatch) {
				console.log(
					`[LeagueCheck] ✅ Match is in one of the target-leagues (${match.league.name})`,
				);
				validLeague.push(match);
			} else {
				console.log(
					`[LeagueCheck] ❌ Match is not in one of the target-leagues (${match.league.name})`,
				);
			}
		}
		return validLeague;
	} catch (error) {
		console.error("Fehler: ", error);
		return null;
	}
}
