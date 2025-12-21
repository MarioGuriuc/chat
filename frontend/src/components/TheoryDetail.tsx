import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_THEORY_QUERY, CREATE_COMMENT_MUTATION, GET_THEORIES_QUERY } from '../graphql/operations';
import { Theory, TheoryStatus } from '../types';

interface TheoryDetailProps {
  theoryId: string;
  onBack: () => void;
}

const TheoryDetail: React.FC<TheoryDetailProps> = ({ theoryId, onBack }) => {
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_THEORY_QUERY, {
    variables: { id: theoryId },
  });

  const [createComment, { loading: commentLoading }] = useMutation(CREATE_COMMENT_MUTATION, {
    onCompleted: () => {
      setCommentContent('');
      setCommentError('');
      refetch();
    },
    onError: (error) => {
      setCommentError(error.message);
    },
    refetchQueries: [{ query: GET_THEORIES_QUERY }],
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (commentContent.length < 3) {
      setCommentError('Comment must be at least 3 characters');
      return;
    }

    createComment({
      variables: {
        input: {
          theoryId,
          content: commentContent,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-conspiracy-green text-xl animate-pulse">
          [DECRYPTING FILE...]
        </div>
      </div>
    );
  }

  if (error || !data?.theory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-conspiracy-red text-xl mb-4">
          ⚠️ ERROR: {error?.message || 'Theory not found'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-conspiracy-green text-conspiracy-darker font-bold hover:bg-conspiracy-amber transition-colors"
        >
          [BACK]
        </button>
      </div>
    );
  }

  const theory: Theory = data.theory;

  const getStatusColor = (status: TheoryStatus) => {
    switch (status) {
      case TheoryStatus.CONFIRMED:
        return 'text-conspiracy-green border-conspiracy-green';
      case TheoryStatus.DEBUNKED:
        return 'text-conspiracy-red border-conspiracy-red';
      case TheoryStatus.UNVERIFIED:
      default:
        return 'text-conspiracy-amber border-conspiracy-amber';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-conspiracy-darker text-conspiracy-green border border-conspiracy-green hover:bg-conspiracy-green/20 transition-colors font-mono"
      >
        [← BACK TO FILES]
      </button>

      <div className="bg-conspiracy-darker border-2 border-conspiracy-green p-8 shadow-2xl shadow-conspiracy-green/30 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-conspiracy-green flex-1 pr-4">
            {theory.title}
          </h1>
          <span
            className={`px-4 py-2 text-sm font-mono border ${getStatusColor(theory.status)}`}
          >
            [{theory.status}]
          </span>
        </div>

        <div className="mb-6 text-sm text-conspiracy-green/60 flex items-center space-x-4">
          <span>
            👤 AUTHOR: {theory.author.isAnonymous ? '[ANONYMOUS]' : theory.author.username}
          </span>
          <span>📅 {formatDate(theory.postedAt)}</span>
          {theory.updatedAt !== theory.postedAt && (
            <span>✏️ UPDATED: {formatDate(theory.updatedAt)}</span>
          )}
        </div>

        <div className="border-t border-conspiracy-green/30 pt-6 mb-6">
          <p className="text-conspiracy-green whitespace-pre-wrap leading-relaxed">
            {theory.content}
          </p>
        </div>

        {theory.evidenceUrls.length > 0 && (
          <div className="border-t border-conspiracy-green/30 pt-6">
            <h3 className="text-xl font-bold text-conspiracy-amber mb-3">
              📎 EVIDENCE FILES:
            </h3>
            <ul className="space-y-2">
              {theory.evidenceUrls.map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-conspiracy-green hover:text-conspiracy-amber transition-colors break-all"
                  >
                    [{index + 1}] {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-conspiracy-darker border-2 border-conspiracy-green p-8 shadow-2xl shadow-conspiracy-green/30">
        <h2 className="text-2xl font-bold text-conspiracy-green mb-6">
          💬 COMMENTS ({theory.comments.length})
        </h2>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <label className="block text-conspiracy-green text-sm mb-2">
            [ADD YOUR ANALYSIS]
          </label>
          {commentError && (
            <div className="bg-conspiracy-red/20 border border-conspiracy-red text-conspiracy-red p-2 mb-3 text-sm">
              ⚠️ {commentError}
            </div>
          )}
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full bg-conspiracy-dark border border-conspiracy-green text-conspiracy-green px-4 py-3 focus:outline-none focus:border-conspiracy-amber font-mono min-h-[100px] resize-y"
            placeholder="Share your thoughts..."
            disabled={commentLoading}
          />
          <button
            type="submit"
            disabled={commentLoading}
            className="mt-3 px-6 py-2 bg-conspiracy-green text-conspiracy-darker font-bold hover:bg-conspiracy-amber transition-colors disabled:opacity-50"
          >
            {commentLoading ? '[POSTING...]' : '[POST COMMENT]'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {theory.comments.length === 0 ? (
            <div className="text-center text-conspiracy-green/50 py-8 border border-conspiracy-green/30 border-dashed">
              [NO COMMENTS YET - BE THE FIRST TO ANALYZE]
            </div>
          ) : (
            theory.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-conspiracy-dark border border-conspiracy-green/50 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-conspiracy-amber text-sm font-mono">
                    👤 {comment.author.isAnonymous ? '[ANONYMOUS]' : comment.author.username}
                  </span>
                  <span className="text-conspiracy-green/50 text-xs">
                    {formatDate(comment.postedAt)}
                  </span>
                </div>
                <p className="text-conspiracy-green whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TheoryDetail;
