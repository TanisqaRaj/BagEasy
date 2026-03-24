import { useState } from 'react';
import UploadSection from './components/UploadSection';
import ValidationReport from './components/ValidationReport';
import Header from './components/Header';

function App() {
  const [validationReport, setValidationReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidationComplete = (report) => {
    setValidationReport(report);
    setLoading(false);
  };

  const handleUploadStart = () => {
    setLoading(true);
    setValidationReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Business Contract Validator
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered contract analysis using Endee vector database
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Upload your contract and get instant risk assessment
            </p>
          </div>

          <UploadSection 
            onValidationComplete={handleValidationComplete}
            onUploadStart={handleUploadStart}
          />

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Analyzing contract...</p>
            </div>
          )}

          {validationReport && !loading && (
            <ValidationReport report={validationReport} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Powered by Endee Vector Database | Built with React & FastAPI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
