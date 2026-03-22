import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ImageUpload from './components/ImageUpload';

const API_KEY = process.env.GEMINI_API_KEY;

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

      

  const handleSubmit = async () => {
    if (!email || !description) {
      setError('Please fill out all required fields.');
      return;
    }

    // Check total file size (5MB limit for Web3Forms Free tier)
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    if (totalSize > MAX_SIZE) {
      setError('Total file size exceeds 5MB. Please upload smaller files or fewer images.');
      return;
    }

    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const formDataToSend = new FormData();
      
      // 1. Add your Web3Forms Access Key
      formDataToSend.append("access_key", "c71503ae-5c37-4b99-83a2-3bd349c9496e");
      
      // 2. Add your form fields
      formDataToSend.append("email", email);
      formDataToSend.append("description", description);
      
      // 3. Add your images (if any)
      // Web3Forms works best if you label them uniquely or as an array
      files.forEach((file, index) => {
        formDataToSend.append(`attachment_${index}`, file);
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setEmail('');
        setDescription('');
        setFiles([]);
      } else {
        setError(data.message || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-purple-900/30 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">3D Print Idea Generator</h1>
          <p className="mt-3 text-lg text-slate-400">Upload a sketch or photo and let AI design a 3D printable model concept for you.</p>
        </header>

        <main>
          {submitted ? (
            <div className="card bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">Thank You!</h2>
              <p className="text-slate-300">Your design request has been sent. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="card bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">Your Email</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full rounded-md bg-slate-800/50 border-slate-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-300">Describe your idea</label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="block w-full rounded-md bg-slate-800/50 border-slate-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">The more details you provide, the better the result!</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">Upload images (optional)</label>
                  <div className="mt-1">
                    <ImageUpload setFiles={setFiles} setError={setError} files={files} />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}


        </main>
      </div>
    </div>
  );
}
