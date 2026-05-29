export function buildEmbed(data: any) {
	const formattedDate = formatDate(data.scheduled_at);
	return {
		content: null,
		embeds: [
			{
				title: data.name,
				description: `Patch: ${data.videogame_version.name}\nStart: ${formattedDate}\nType: ${data.tournament.name}\nLeague: ${data.league.name}`,
				color: null,
				fields: [
					{
						name: data.opponents[0].opponent.name,
						value: data.results[0].score,
						inline: true,
					},
					{
						name: data.opponents[1].opponent.name,
						value: data.results[1].score,
						inline: true,
					},
				],
			},
		],
		attachments: [],
	};
}

export async function postEmbed(data: any) {
	try {
		const webhookUrl = process.env.DISCORD_WEBHOOK;
		if (!webhookUrl) {
			throw new Error("DISCORD_WEBHOOK environment variable is not set");
		}

		const embed = buildEmbed(data);
		if (embed) {
			await fetch(webhookUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(embed),
			});
		}
	} catch (error) {
		console.error("Error posting embed to Discord: ", error);
	}
}

function formatDate(date: any) {
	const dateObj = new Date(date);
	const day = String(dateObj.getUTCDate()).padStart(2, "0");
	const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
	const year = dateObj.getUTCFullYear();
	const hours = String(dateObj.getUTCHours()).padStart(2, "0");
	const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
	return `${day}.${month}.${year} ${hours}:${minutes}Uhr`;
}
