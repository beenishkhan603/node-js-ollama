import express from 'express';
import ollama from 'ollama';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('backend up');
});
// Define the endpoint
app.post('/api/query', async (req, res) => {
	const { query } = req.body;

	try {
		// Call the test function with the provided query
		const response = await test(query);

		// Send the response back to the client
		res.json(response);
	} catch (error) {
		// Handle errors
		console.error(error);
		res.status(500).json({ error: error });
	}
});

// Test function
const test = async (query) => {
	const response = await ollama.chat({
		model: 'llama2',
		messages: [{ role: 'user', content: query }],
	});

	return response.message.content;
};

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
