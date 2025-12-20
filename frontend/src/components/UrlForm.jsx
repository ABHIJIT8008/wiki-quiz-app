import { useState } from 'react';
import { Link2, Sparkles } from 'lucide-react';

export default function UrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Wiki Quiz Generator
        </h2>
        <p className="text-gray-500">
          Paste a Wikipedia link and let AI challenge you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Link2 className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="url"
          required
          placeholder="https://en.wikipedia.org/wiki/React_(software)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all text-gray-700"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </form>

      <div className="flex justify-center gap-2 text-sm text-gray-500">
        <span>Try:</span>
        <button 
          onClick={() => setUrl("https://en.wikipedia.org/wiki/Elon_Musk")}
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Elon Musk
        </button>
        <span>•</span>
        <button 
          onClick={() => setUrl("https://en.wikipedia.org/wiki/Quantum_computing")}
          className="hover:text-blue-600 underline cursor-pointer"
        >
          Quantum Computing
        </button>
      </div>
    </div>
  );
}