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
	baseURL: 'http://127.0.0.1:11434/v1/', // you were missing this. please change it to your local server if different
	apiKey: process.env.OPENAI_KEY, // we declare this but its not used anywhere so dont worry about it
});
console.log(process.env.OPENAI_KEY);

// Define the endpoint
app.post('/api/query', async (req, res) => {
	const { query } = req.body;
	try {
		// Call the test function with the provided query
		console.log('in try', query);
		const response = await getModelResponse(query);
		// Send the response back to the client
		res.json(response);
	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

const getModelResponse = async (query) => {
	const completion = await client.chat.completions.create({
		model: 'llama2',
		messages: query,
	});
	return completion.choices[0].message.content;
};

// Start the server
const server = app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
server.requestTimeout = 610000;
server.headersTimeout = 610000;
server.keepAliveTimeout = 600000;
server.timeout = 600000;
