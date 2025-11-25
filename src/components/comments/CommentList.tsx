import React, { useState } from 'react';
import { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';

interface CommentListProps {
    comments: Comment[];
    onReply: (content: string, parentId: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
}

const CommentItem: React.FC<{
    comment: Comment;
    onReply: (content: string, parentId: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
    depth?: number;
}> = ({ comment, onReply, onDelete, depth = 0 }) => {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async (content: string) => {
        setIsSubmitting(true);
        try {
            await onReply(content, comment.id);
            setIsReplying(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            await onDelete(comment.id);
        }
    };

    const isOwner = user?.id === comment.user_id;
    const formattedDate = new Date(comment.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={`mb-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {comment.user?.avatar_url ? (
                        <img
                            src={comment.user.avatar_url}
                            alt={comment.user.full_name}
                            className="w-8 h-8 rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                            {comment.user?.full_name?.charAt(0) || '?'}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {comment.user?.full_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formattedDate}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                            {comment.content}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-1 text-xs">
                        {user && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 font-medium"
                            >
                                Reply
                            </button>
                        )}
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-3">
                            <CommentForm
                                onSubmit={handleReply}
                                isSubmitting={isSubmitting}
                                placeholder="Write a reply..."
                                buttonText="Reply"
                                onCancel={() => setIsReplying(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommentList: React.FC<CommentListProps> = ({ comments, onReply, onDelete }) => {
    // Organize comments into a tree structure
    const rootComments = comments.filter(c => !c.parent_id);
    const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

    return (
        <div className="space-y-6">
            {rootComments.map(comment => (
                <div key={comment.id}>
                    <CommentItem
                        comment={comment}
                        onReply={onReply}
                        onDelete={onDelete}
                    />
                    {getReplies(comment.id).map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            depth={1}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CommentList;
