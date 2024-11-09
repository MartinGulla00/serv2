import { useState } from 'react';
import { PostInterface } from '../types';

export const Post = ({ post }: { post: PostInterface }) => {
  const [seeComments, setSeeComments] = useState(false);
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4">
      <img
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.image_url}`}
        alt={post.description}
      />
      <h2 className="text-lg font-bold">{post.description}</h2>
      <p>{post.created_at}</p>
      <p>{post.likes?.length} likes</p>
      <p>{post.comments?.length} comments</p>
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
  );
};
