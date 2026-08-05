const item = $input.first().json;

const prompt = [
  'Create a LinkedIn post for Ellis AI Studio.',
  '',
  'Business positioning:',
  'Ellis AI Studio identifies business problems and builds AI-powered',
  'solutions that save time, reduce costs, and help businesses grow.',
  '',
  `Topic: ${item.topic}`,
  `Audience: ${item.audience}`,
  `Goal: ${item.goal}`,
  `Call to action: ${item.cta}`,
  `Website: ${item.website}`,
  '',
  'Requirements:',
  '- Start with a strong business-problem hook.',
  '- Use clear, confident language.',
  '- Keep the post between 120 and 220 words.',
  '- Focus on business outcomes, not proprietary workflow details.',
  '- Do not invent statistics, customers, testimonials, or results.',
  '- Use short readable paragraphs.',
  '- Include no more than four relevant hashtags.',
  '- End with the requested call to action.',
  '- Return only the finished LinkedIn post.'
].join('\n');

return [{
  json: {
    ...item,
    openaiRequestBody: {
      model: item.openaiModel || 'gpt-5-mini',
      input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }]
    }
  }
}];
