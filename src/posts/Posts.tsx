import { Post } from './Post';
import useRealtimePosts from '../utils/useRealTimePosts';
import { PostInterface } from '../types';

export const Posts = ({ profilePosts }: { profilePosts?: PostInterface[] }) => {
  const posts = useRealtimePosts();
  if (profilePosts) {
    return (
      <div className="w-full flex flex-col items-center">
        {profilePosts.length === 0 && <p>No posts found</p>}
        {profilePosts.length > 0 && (
          <div className="flex flex-col gap-4 w-full">
            {profilePosts?.map((post) => <Post key={post.id} post={post} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {posts.length === 0 && <p>No posts found</p>}
      {posts.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {posts?.map((post) => <Post key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
};
