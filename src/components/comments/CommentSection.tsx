import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import { Comment } from '../../types/types';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          user:user_id (
            full_name,
            avatar_url
          )
        `
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to match Comment interface (handling the joined user data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedComments = (data || []).map((item: any) => ({
        ...item,
        user: item.user, // Supabase returns joined data as an object or array depending on relationship
      }));

      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();

    // Subscribe to new comments only if supabase is available
    if (!supabase) return;

    const subscription = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId, fetchComments]);

  const handlePostComment = async (content: string, parentId: string | null = null) => {
    if (!user || !supabase) return;

    setIsSubmitting(true);
    try {
      // @ts-expect-error - Supabase comments table type inference issue
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content,
        parent_id: parentId,
      });

      if (error) throw error;

      // Optimistic update or wait for subscription
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) throw error;

      // Optimistic update
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="py-8 border-t border-gray-200 dark:border-gray-700 mt-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Comments ({comments.length})
      </h3>

      <CommentForm onSubmit={(content) => handlePostComment(content)} isSubmitting={isSubmitting} />

      <div className="mt-8">
        {comments.length > 0 ? (
          <CommentList
            comments={comments}
            onReply={(content, parentId) => handlePostComment(content, parentId)}
            onDelete={handleDeleteComment}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
