function ValidationReport({ report }) {
  if (!report) return null;

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[risk] || colors.low;
  };

  const getStatusIcon = (status) => {
    const icons = {
      present: '✓',
      missing: '✗',
      ambiguous: '⚠',
      risky: '⚠'
    };
    return icons[status] || '?';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Validation Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Contract</p>
            <p className="text-lg font-semibold text-gray-900">{report.filename}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Overall Risk</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(report.overall_risk)}`}>
              {report.overall_risk.toUpperCase()}
            </span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Clauses Analyzed</p>
            <p className="text-lg font-semibold text-gray-900">{report.clauses.length}</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-gray-700">{report.summary}</p>
        </div>

        {report.recommendations.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}


        {report.missing_clauses.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Missing Critical Clauses</h3>
            <div className="flex flex-wrap gap-2">
              {report.missing_clauses.map((clause, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {clause}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Clause Analysis</h3>
        
        <div className="space-y-4">
          {report.clauses.map((clause, idx) => (
            <div key={idx} className={`p-4 border rounded-lg ${getRiskColor(clause.risk_level)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getStatusIcon(clause.status)}</span>
                  <div>
                    <h4 className="font-semibold">{clause.type.replace('_', ' ').toUpperCase()}</h4>
                    <span className="text-xs">Status: {clause.status}</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-semibold">
                  Risk: {clause.risk_level.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm mb-2 text-gray-700">{clause.text}</p>
              
              {clause.recommendations.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs font-semibold mb-1">Recommendations:</p>
                  <ul className="text-xs space-y-1">
                    {clause.recommendations.map((rec, ridx) => (
                      <li key={ridx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ValidationReport;
