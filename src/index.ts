import "dotenv/config";
import { postEmbed } from "./bot/discord.js";
import { validLeagues } from "./api/pandascore.js";
import { addMatch, matchAlreadySent } from "./data/stateManager.js";

const POLLING_INTERVAL = 5 * 60 * 1000;

async function main() {
	async function tickerLoop() {
		const matches = await validLeagues();
		try {
			for (const match of matches) {
				if (!matchAlreadySent(match.id)) {
					postEmbed(match);
					addMatch(match);
				}
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	}

	tickerLoop();
	setInterval(tickerLoop, POLLING_INTERVAL);
}

main();
