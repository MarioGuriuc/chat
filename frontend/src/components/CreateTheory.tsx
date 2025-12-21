import React, { useState } from 'react';
import { useMutation } from '../apollo-imports';
import { CREATE_THEORY_MUTATION, GET_THEORIES_QUERY } from '../graphql/operations';
import { TheoryStatus, Theory, TheoryInput } from '../types';

interface CreateTheoryProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface CreateTheoryData {
  createTheory: Theory;
}

interface CreateTheoryVariables {
  input: TheoryInput;
}

const CreateTheory: React.FC<CreateTheoryProps> = ({ onBack, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<TheoryStatus>(TheoryStatus.UNVERIFIED);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['']);
  const [error, setError] = useState('');

  const [createTheory, { loading }] = useMutation<CreateTheoryData, CreateTheoryVariables>(CREATE_THEORY_MUTATION, {
    onCompleted: () => {
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_THEORIES_QUERY }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (content.length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    const filteredUrls = evidenceUrls.filter(url => url.trim() !== '');

    createTheory({
      variables: {
        input: {
          title,
          content,
          status,
          evidenceUrls: filteredUrls,
        },
      },
    });
  };

  const addEvidenceField = () => {
    setEvidenceUrls([...evidenceUrls, '']);
  };

  const updateEvidenceUrl = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const removeEvidenceField = (index: number) => {
    const newUrls = evidenceUrls.filter((_, i) => i !== index);
    setEvidenceUrls(newUrls.length === 0 ? [''] : newUrls);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 transition-colors font-mono"
      >
        [← CANCEL]
      </button>

      <div className="bg-conspiracy-darker border-2 border-conspiracy-green p-8 shadow-2xl shadow-conspiracy-green/30">
        <h2 className="text-3xl font-bold text-conspiracy-green mb-2">
          📝 CREATE NEW THEORY
        </h2>
        <p className="text-conspiracy-green/70 text-sm mb-8">
          [CLASSIFIED - SUBMIT YOUR FINDINGS]
        </p>

        {error && (
          <div className="bg-conspiracy-red/20 border border-conspiracy-red text-conspiracy-red p-3 mb-6 text-sm">
            ⚠️ ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-conspiracy-green text-sm mb-2">
              [THEORY TITLE] *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-3 focus:outline-none focus:border-conspiracy-amber font-mono"
              placeholder="e.g., Area 51 Underground Tunnels..."
              required
            />
            <p className="text-conspiracy-green/50 text-xs mt-1">
              Min. 5 characters
            </p>
          </div>

          <div>
            <label className="block text-conspiracy-green text-sm mb-2">
              [THEORY CONTENT] *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-3 focus:outline-none focus:border-conspiracy-amber font-mono min-h-[200px] resize-y"
              placeholder="Detailed description of your theory..."
              required
            />
            <p className="text-conspiracy-green/50 text-xs mt-1">
              Min. 10 characters
            </p>
          </div>

          <div>
            <label className="block text-conspiracy-green text-sm mb-2">
              [STATUS]
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TheoryStatus)}
              className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-3 focus:outline-none focus:border-conspiracy-amber font-mono"
            >
              <option value={TheoryStatus.UNVERIFIED}>UNVERIFIED</option>
              <option value={TheoryStatus.CONFIRMED}>CONFIRMED</option>
              <option value={TheoryStatus.DEBUNKED}>DEBUNKED</option>
            </select>
          </div>

          <div>
            <label className="block text-conspiracy-green text-sm mb-2">
              [EVIDENCE URLS] (Optional)
            </label>
            <div className="space-y-2">
              {evidenceUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateEvidenceUrl(index, e.target.value)}
                    className="flex-1 bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-2 focus:outline-none focus:border-conspiracy-amber font-mono"
                    placeholder="https://..."
                  />
                  {evidenceUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEvidenceField(index)}
                      className="px-4 py-2 bg-conspiracy-red text-white border border-conspiracy-red hover:bg-conspiracy-red/80 transition-colors"
                    >
                      [X]
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEvidenceField}
              className="mt-2 px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 transition-colors text-sm"
            >
              [+ ADD EVIDENCE URL]
            </button>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-conspiracy-green text-conspiracy-darker font-bold hover:bg-conspiracy-amber transition-colors disabled:opacity-50"
            >
              {loading ? '[SUBMITTING...]' : '[SUBMIT THEORY]'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 transition-colors font-mono"
            >
              [CANCEL]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTheory;
