import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTaskComments, useCreateTaskComment } from '@/hooks/useTaskComments';
import { Trash2, Send } from 'lucide-react';

interface TaskCommentListProps {
  taskId: string;
  currentUserId?: string;
}

export function TaskCommentList({ taskId, currentUserId }: TaskCommentListProps) {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const createComment = useCreateTaskComment();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    createComment.mutate({
      taskId,
      authorId: currentUserId,
      content: newComment.trim(),
    });
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Comments</h4>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{comment.authorName || 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newComment.trim() || createComment.isPending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
