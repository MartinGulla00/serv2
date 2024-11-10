import { CommentInterface } from '../types';
import { formatTimeForPost } from '../utils/formatDate';

export const Comment = ({ comment }: { comment: CommentInterface }) => {
  return (
    <div key={comment.id} className="p-2 flex gap-1 items-center">
      <img
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${comment.profile?.avatar_url}`}
        alt={comment.profile?.username}
        className="h-8 w-8 rounded-full"
      />
      <div className="font-bold">{comment.profile?.username}:</div>
      <div>{comment.content}</div>
      <p>- {formatTimeForPost(comment.created_at)}</p>
    </div>
  );
};
