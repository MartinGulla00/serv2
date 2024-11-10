import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { PostInterface } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Post } from './Post';

export const Posts = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [page, setPage] = useState(1);

  const fetchPosts = () => ({
    queryKey: ['posts', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
            *,
            profile: profile_id ( id, username, avatar_url ),
            comments_count: comments ( id ),
            likes_count: likes ( id )
          `
        )
        .order('created_at', { ascending: false })
        .range((page - 1) * 1, page * 1 - 1);
      if (error) {
        return false;
      } else {
        if (data.length < 1) {
          return false;
        }
        setPosts((prev) => [...prev, ...data]);
        return true;
      }
    },
    refetchOnWindowFocus: false,
  });

  const { isLoading, data: lastCallReturnedData } = useQuery(fetchPosts());

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold">Posts</h1>
      {!isLoading && posts.length === 0 && <p>No posts found</p>}
      {!isLoading && posts.length > 0 && (
        <>
          <div className="flex flex-col gap-4 w-1/2">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
          {!isLoading && lastCallReturnedData ? (
            <button onClick={() => setPage((prev) => prev + 1)}>
              Load more
            </button>
          ) : (
            <p>No more posts to load</p>
          )}
        </>
      )}
    </div>
  );
};
