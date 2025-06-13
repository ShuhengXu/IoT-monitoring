import React, { useState } from 'react';

const QuestionBox: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAsk = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setAnswer('');
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnswer(data.answer);
            } else {
                setError(data.error || 'Server error!');
            }
        } catch (err) {
            setError('Connection failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            style={{
                marginTop: '3rem',
                padding: '2rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: '#f7f9fc',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <h2 style={{ fontSize: '1.0rem', marginBottom: '1rem', color: '#333' }}>
                🤖 AI Assist
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question..."
                    style={{
                        flex: 1,
                        padding: '0.6rem 1rem',
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        transition: 'border 0.2s',
                    }}
                    onFocus={(e) => e.currentTarget.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.currentTarget.style.border = '1px solid #ccc'}
                />
                <button
                    onClick={handleAsk}
                    disabled={loading}
                    style={{
                        padding: '0.6rem 1.2rem',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        backgroundColor: loading ? '#999' : '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Thinking...' : 'Ask'}
                </button>
            </div>

            {answer && (
                <div
                    style={{
                        marginTop: '1.5rem',
                        backgroundColor: '#e6ffed',
                        padding: '1rem',
                        borderLeft: '4px solid #28a745',
                        borderRadius: '6px',
                        color: '#155724'
                    }}
                >
                    <strong>AI Answer:</strong>
                    <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-line' }}>{answer}</p>
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginTop: '1rem',
                        backgroundColor: '#ffe6e6',
                        padding: '1rem',
                        borderLeft: '4px solid #dc3545',
                        borderRadius: '6px',
                        color: '#721c24'
                    }}
                >
                    ❗ <strong>Error:</strong> {error}
                </div>
            )}
        </section>
    );
};

export default QuestionBox;
