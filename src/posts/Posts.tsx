import { Post } from './Post';
import useRealtimePosts from '../utils/useRealTimePosts';

export const Posts = () => {
  const posts = useRealtimePosts();

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
