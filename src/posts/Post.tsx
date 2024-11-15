import { useState } from 'react';
import { PostInterface } from '../types';
import { LikeIcon } from '../icons/LikeIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { formatTimeForPost } from '../utils/formatDate';

export const Post = ({ post }: { post: PostInterface }) => {
  const [seeComments, setSeeComments] = useState(false);

  return (
    <div className="border-2 border-gray-300 rounded-lg flex flex-col">
      <div className="flex gap-2 p-2 items-center">
        <img
          src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.profile?.avatar_url}`}
          alt={post.profile?.username}
          className="h-8 w-8 rounded-full"
        />
        <div>{post.profile?.username}</div>
        <p>{formatTimeForPost(post.created_at)}</p>
      </div>
      <img
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.image_url}`}
        alt={post.description}
      />
      <div className="p-2">
        <div className="flex w-full gap-4">
          <div className="flex gap-2">
            <LikeIcon />
            <span>{post.likes?.length ?? 0}</span>
          </div>
          <div className="flex gap-2">
            <CommentIcon />
            <span>{post.comments?.length ?? 0}</span>
          </div>
        </div>
        <div className="flex">
          <div className="font-bold">{post.profile?.username}</div>
          <div>{`: ${post.description}`}</div>
        </div>
        <button onClick={() => setSeeComments((prev) => !prev)}>
          {seeComments ? 'Hide' : 'See'} comments
        </button>
        {seeComments && (
          <div>
            {post.comments?.map((comment) => (
              <div
                key={comment.id}
                className="border-2 border-gray-300 rounded-lg p-2"
              >
                <p>{comment.content}</p>
                <p>{comment.created_at}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
