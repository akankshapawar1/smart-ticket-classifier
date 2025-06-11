import React, { useState } from 'react';

const TicketClassifier: React.FC = () => {
  const [ticketText, setTicketText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [assignedTeam, setAssignedTeam] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
        const response = await fetch('/ticket/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: ticketText }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        setResult(data);

        const solutionsResponse = await fetch('/ticket/solutions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classification: data }),
            });

        if (!solutionsResponse.ok) {
            throw new Error(`Solutions server error: ${solutionsResponse.statusText}`);
        }

        const solutionsData = await solutionsResponse.json();
        setSolutions(solutionsData);

        // After fetching solutions:
        const routeResponse = await fetch('/ticket/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classification: data }),
        });

        if (!routeResponse.ok) {
            throw new Error(`Routing server error: ${routeResponse.statusText}`);
        }

        const routeData = await routeResponse.json();
        setAssignedTeam(routeData.assignedTeam);

    } catch (error) {
        console.error('Error:', error);
        alert('Error classifying the ticket.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h2>Support Ticket Classifier</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          value={ticketText}
          onChange={(e) => setTicketText(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          placeholder="Paste ticket text here..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Classifying...' : 'Classify Ticket'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Classification Result:</h3>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Urgency:</strong> {result.urgency}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
        </div>
      )}

      {solutions.length > 0 && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Suggested Solutions:</h3>
            <ul>
            {solutions.map((solution) => (
                <li key={solution.id}>
                <strong>{solution.title}</strong>: {solution.summary}
                </li>
            ))}
            </ul>
        </div>
        )}

    {assignedTeam && (
        <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>Assigned Team:</h3>
            <p>{assignedTeam}</p>
        </div>
    )}

    </div>
  );
};

export default TicketClassifier;