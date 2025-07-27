'use client';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const suggestedQuestions = [
  "¿Qué es Wompi?",
  "¿Cómo funciona Wompi?", 
  "¿Qué métodos de pago acepta?",
  "¿Cómo integrar Wompi en mi sitio web?",
  "¿Cuáles son las tarifas de Wompi?",
  "¿Qué medidas de seguridad tiene Wompi?"
];

export default function SuggestedQuestions({ onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <p className="text-sm text-gray-600 mb-3">Preguntas sugeridas:</p>
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}