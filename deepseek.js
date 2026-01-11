export default async function handler(req, res) {
  // 1. Получаем текст из GET-запроса (параметр ?text=...)
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Нужно указать параметр text' });
  }

  // 2. Ваш API-ключ DeepSeek (берется из настроек Vercel)
  const apiKey = process.env.DEEPSEEK_API_KEY;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: text }
        ],
        stream: false
      })
    });

    const data = await response.json();
    
    // 3. Возвращаем только текст ответа от нейросети
    const aiResponse = data.choices[0].message.content;
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    res.status(500).json({ error: 'Ошибка при запросе к DeepSeek', details: error.message });
  }
}