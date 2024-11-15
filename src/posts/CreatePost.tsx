import { useEffect, useState } from 'react';
import ImageDropzone from '../inputs/ImageDropzone';
import { TextInput } from '../inputs/TextInput';
import { supabase } from '../supabase/supabaseClient';
import { ProfileInterface } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { ProfileBadge } from '../profiles/ProfileBadge';
import { LikeIcon } from '../icons/LikeIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<ProfileInterface>();
  const [loading, setLoading] = useState(false);

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

  const handleCreatePost = async () => {
    setLoading(true);
    if (!image) {
      alert('Please upload an image');
      setLoading(false);
      return;
    }
    if (!description) {
      alert('Please enter a description');
      setLoading(false);
      return;
    }
    const randomName = Math.random().toString(36).substring(6);
    await supabase.storage.from('images').upload(`posts/${randomName}`, image);
    supabase
      .from('posts')
      .insert({
        description,
        image_url: `posts/${randomName}`,
        profile_id: profile?.id,
      })
      .select('id')
      .then(async ({ data }) => {
        const postId = data ? data[0]?.id : '';

        const createdAt = format(new Date(), 'dd-MM-yyyy');
        const body = {
          username: profile?.username,
          createdAt,
          description,
          imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/posts/${randomName}`,
          postId: `${postId}`,
        };
        await supabase.functions.invoke('notify-post', {
          body,
        });
        setLoading(false);
        navigate(ROUTES.HOME);
      });
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="w-full grid grid-cols-4 gap-4 text-center overflow-hidden">
      <div className="flex flex-col gap-4 h-screen overflow-hidden">
        <button
          className="flex border rounded-xl items-center justify-center h-12"
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Home
        </button>
      </div>
      <div className="border-2 border-gray-300 rounded-lg flex flex-col w-full h-[95%] col-span-2 overflow-scroll">
        <div className="flex gap-2 p-2 items-center">
          <ProfileBadge profile={profile} />
          <p>- Just now</p>
        </div>
        <ImageDropzone
          onImageUpload={(file) => setImage(file)}
          setError={() => {}}
          image={image}
          className={twMerge(
            'self-center',
            !image && ' border-y border-gray-300 rounded-none w-full py-20'
          )}
        />
        <div className="p-2 flex flex-col">
          <div className="flex w-full gap-4">
            <button className="flex gap-2">
              <LikeIcon />
              <span>0</span>
            </button>
            <div className="flex gap-2">
              <CommentIcon />
              <span>0</span>
            </div>
          </div>
          <div className="flex items-start mt-2">
            <TextInput
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              label="Description"
              type="text-area"
              placeholder=""
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="flex border rounded-lg items-center justify-center h-12 m-2 disabled:opacity-50"
          onClick={handleCreatePost}
        >
          Create Post
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="flex self-start items-center h-12 rounded-xl border justify-center"
          onClick={() =>
            navigate(ROUTES.PROFILE.replace(':userid', profile?.user_id ?? ''))
          }
        >
          {profile ? <ProfileBadge profile={profile} /> : 'Profile'}
        </button>
        <button
          onClick={handleLogout}
          className="flex self-start items-center h-12 rounded-xl border justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
