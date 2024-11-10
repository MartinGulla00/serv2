import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { PostInterface } from '../types';

function useRealtimePosts(profileId?: string) {
  const [posts, setPosts] = useState<PostInterface[]>([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        profile: profile_id (id, username, avatar_url),
        comments (id, profile: profiles (username, avatar_url), content, created_at),
        likes: likes (id, profile_id)
      `
      )
      .order('created_at', { ascending: false })
      .eq(profileId ? 'profile_id' : "", profileId || "")

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
        (payload) => {
          console.log('Post change:', payload);
          fetchPosts(); // Vuelve a cargar los posts cuando haya un cambio
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          console.log('Comment change:', payload);
          fetchPosts(); // Vuelve a cargar los posts cuando haya un cambio en comments
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        (payload) => {
          console.log('Like change:', payload);
          fetchPosts(); // Vuelve a cargar los posts cuando haya un cambio en likes
        }
      )
      .subscribe();

    // Limpia la suscripción al desmontar el componente
    return () => {
      supabase.removeChannel(postsSubscription);
    };
  }, []);

  return posts;
}

export default useRealtimePosts;
