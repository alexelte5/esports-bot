import fs from "fs";

export function addMatch(match: any) {
	console.log("[StateManager] Adding match to JSON-file");
	let file = JSON.parse(fs.readFileSync("./data/sent_matches.json", "utf-8"));
	file.push(match.id);

	fs.writeFileSync(
		"./data/sent_matches.json",
		JSON.stringify(file, null, 4),
		"utf-8",
	);
}

export function matchAlreadySent(id: string) {
  console.log("[StateManager] Checking if match was already sent");
	const file = fs.readFileSync('./data/sent_matches.json', "utf-8");
	if (file.includes(id)) {
		return true;
	} else {
		return false;
	}
}
