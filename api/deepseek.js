import axios from 'axios';

export default async function handler(req, res) {
    const { text } = req.query;

    try {
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: text || 'Привет' }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Проверяем, есть ли данные в ответе
        if (response.data && response.data.choices && response.data.choices[0]) {
            res.status(200).json({ result: response.data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Странный ответ от API", details: response.data });
        }

    } catch (error) {
        // Выводим реальную ошибку, которую прислал DeepSeek
        const errorData = error.response ? error.response.data : error.message;
        res.status(500).json({ 
            error: "Ошибка при запросе к DeepSeek", 
            details: errorData 
        });
    }
}
