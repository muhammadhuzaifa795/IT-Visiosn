"use client"

import Button from "daisyui/components/button"



export default function WelcomeSuggestions({ onSuggestionClick }) {
  const suggestions = [
    "Mujhe JavaScript sikhao",
    "What is React and how does it work?",
    "Coding mein problem solve kaise karte hain?",
    "Tell me a joke to lighten the mood",
    "Explain AI in simple terms",
    "Help me plan my day",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="text-left p-4 h-auto whitespace-normal hover:bg-blue-50 hover:border-blue-300 bg-transparent"
          onClick={() => onSuggestionClick(suggestion)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💭</span>
            <span className="text-sm">{suggestion}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}
