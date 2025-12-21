import React from 'react';
import { Theory, TheoryStatus } from '../types';

interface TheoryCardProps {
  theory: Theory;
  onClick: () => void;
}

const TheoryCard: React.FC<TheoryCardProps> = ({ theory, onClick }) => {
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
    <div
      onClick={onClick}
      className="bg-conspiracy-darker border-2 border-conspiracy-green hover:border-conspiracy-amber transition-colors cursor-pointer p-6 shadow-lg hover:shadow-conspiracy-green/30"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-conspiracy-green flex-1 pr-4">
          {theory.title}
        </h3>
        <span
          className={`px-3 py-1 text-xs font-mono border ${getStatusColor(theory.status)}`}
        >
          [{theory.status}]
        </span>
      </div>

      <p className="text-conspiracy-green/80 mb-4 line-clamp-2">
        {theory.content}
      </p>

      <div className="flex justify-between items-center text-sm text-conspiracy-green/60">
        <div className="flex items-center space-x-4">
          <span>
            👤 {theory.author.isAnonymous ? '[ANONYMOUS]' : theory.author.username}
          </span>
          <span>💬 {theory.commentCount} comments</span>
          {theory.evidenceUrls.length > 0 && (
            <span>📎 {theory.evidenceUrls.length} evidence</span>
          )}
        </div>
        <span className="text-xs">
          {formatDate(theory.postedAt)}
        </span>
      </div>
    </div>
  );
};

export default TheoryCard;
