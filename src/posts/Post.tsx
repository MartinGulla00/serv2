import { useEffect, useState } from 'react';
import { PostInterface, ProfileInterface } from '../types';
import { LikeIcon } from '../icons/LikeIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { formatTimeForPost } from '../utils/formatDate';
import { TextInput } from '../inputs/TextInput';
import { supabase } from '../supabase/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { Comment } from './Comment';
import { twMerge } from 'tailwind-merge';

export const Post = ({ post }: { post: PostInterface }) => {
  const [seeComments, setSeeComments] = useState(false);
  const [createComment, setCreateComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const [profile, setProfile] = useState<ProfileInterface | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data?.user?.id)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setProfile(data[0]);
          }
        });
    });
  }, []);
  const queryClient = useQueryClient();
  const handleCreateComment = async () => {
    await supabase.from('comments').insert({
      post_id: post.id,
      content: commentContent,
      profile_id: profile?.id,
    });
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const hasLikeFromUser = post.likes?.some(
    (like) => like.profile_id === profile?.id
  );

  const toggleLike = async () => {
    if (hasLikeFromUser) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('profile_id', profile?.id);
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: post.id, profile_id: profile?.id });
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg flex flex-col">
      <div className="flex gap-2 p-2 items-center">
        <img
          src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.profile?.avatar_url}`}
          alt={post.profile?.username}
          className="h-8 w-8 rounded-full"
        />
        <div>{post.profile?.username}</div>
        <p>- {formatTimeForPost(post.created_at)}</p>
      </div>
      <img
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.image_url}`}
        alt={post.description}
      />
      <div className="p-2 flex flex-col">
        <div className="flex w-full gap-4">
          <button className="flex gap-2" onClick={toggleLike}>
            <LikeIcon
              className={twMerge(
                hasLikeFromUser && 'text-red-500 stroke-red-500'
              )}
            />
            <span>{post.likes?.length ?? 0}</span>
          </button>
          <div
            className="flex gap-2"
            onClick={() => setSeeComments((prev) => !prev)}
          >
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
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        {createComment ? (
          <div className="flex gap-4 mt-2">
            <TextInput
              onChange={(e) => setCommentContent(e.target.value)}
              value={commentContent}
              placeholder="Add a comment"
            />
            <button type="button" onClick={handleCreateComment}>
              Submit
            </button>
            <button
              onClick={() => {
                setCreateComment(false);
                setCommentContent('');
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setCreateComment(true)}>Add comment</button>
        )}
      </div>
    </div>
  );
};
