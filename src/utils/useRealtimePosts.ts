import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { PostInterface } from '../types';

function useRealtimePosts() {
  const [posts, setPosts] = useState<PostInterface[]>([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        profile: profile_id (id, username, avatar_url, user_id, full_name),
        comments (id, profile: profiles (id, username, avatar_url, user_id, full_name), content, created_at),
        likes (id, profile: profiles (id, username, avatar_url, user_id, full_name))
      `
      )
      .order('created_at', { ascending: false })
      .eq('approved', true);

    if (error) console.error('Error fetching posts:', error);
    else setPosts(data);
  };

  useEffect(() => {
    // Cargar los posts inicialmente
    fetchPosts();

    // Suscribirse a cambios en la tabla de posts
    const postsSubscription = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        fetchPosts
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        fetchPosts
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        fetchPosts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsSubscription);
    };
  }, []);

  return posts;
}

export default useRealtimePosts;
