
// コードのみ要求するプロンプト
export function createCodeOnlyPrompt(question: string): string {
  return `I need only executable code with no explanations. The code should be directly usable without modification.

Requirements:
- Return ONLY the implementation, no markdown code blocks
- Do not include any explanation text before or after the code
- Include necessary imports
- Include brief in-code comments if needed for clarity

Here's my request: ${question}`;
}
