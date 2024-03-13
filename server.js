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
	baseURL: 'http://localhost:11434/v1/',	// you were missing this. please change it to your local server if different
	apiKey: process.env.OPENAI_KEY,	// we declare this but its not used anywhere so dont worry about it
});

// Define the endpoint
app.post('/api/query', async (req, res) => {
	const { query } = req.body;
	console.log('query', query);

	try {
		// Call the test function with the provided query
		console.log('in try');
		const response = await test(query);
		console.log(res)
		// Send the response back to the client
		res.json(response);
	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

// Test function
// this was wrong. please see docs here https://ollama.com/blog/openai-compatibility 
// check diff on what things i changed
const test = async (query) => {
	const completion = await client.chat.completions.create({
		model: 'llama2',
		messages: [{ role: 'user', content: query }],
	});
	console.log(completion)
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
