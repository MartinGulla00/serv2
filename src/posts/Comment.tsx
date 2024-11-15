import { ProfileBadge } from '../profiles/ProfileBadge';
import { CommentInterface } from '../types';
import { formatTimeForPost } from '../utils/formatDate';

export const Comment = ({ comment }: { comment: CommentInterface }) => {
  return (
    <div key={comment.id} className="p-2 flex gap-1 items-center">
      <ProfileBadge profile={comment.profile} />
      <div>: {comment.content}</div>
      <p>- {formatTimeForPost(comment.created_at)}</p>
    </div>
  );
};
