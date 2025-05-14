import React from "react";
import TextEditor from "./components/TextEditor";

const App: React.FC = () => {
  const handleParaphrase = async (
    selectedText: string,
    updateText: (newText: string) => void
  ) => {
    try {
      // Send the selected text to the backend for paraphrasing
      const response = await fetch("http://localhost:8000/paraphrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selectedText }), // Passing selected text
      });

      // Parse the response to get the paraphrased text
      const data = await response.json();

      // Update the editor with the paraphrased text
      updateText(data.paraphrased);
    } catch (error) {
      console.error("Failed to paraphrase:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">AI Paraphraser</h1>
      <TextEditor />
    </div>
  );
};

export default App;
