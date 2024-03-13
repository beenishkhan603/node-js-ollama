import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import 'dotenv/config';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Initialize OpenAI client
const client = new OpenAI({
	apiKey: process.env.OPENAI_KEY,
});

// Define the endpoint
app.post('/api/query', async (req, res) => {
	const { query } = req.body;
	console.log('query', query);

	try {
		// Call the test function with the provided query
		console.log('in try');
		const response = await test(query);

		// Send the response back to the client
		res.json(response);
	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Test function
const test = async (query) => {
	const response = await client.chat.completions.create({
		model: 'llama2',
		messages: query,
	});
	return response.data.choices[0].text;
};

// Start the server
const server = app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
server.requestTimeout = 610000;
server.headersTimeout = 610000;
server.keepAliveTimeout = 600000;
server.timeout = 600000;
