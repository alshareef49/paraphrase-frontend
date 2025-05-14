import React from "react";
import TextEditor from "./components/TextEditor";

const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">AI Paraphraser</h1>
      <TextEditor />
    </div>
  );
};

export default App;
