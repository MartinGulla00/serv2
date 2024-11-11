import { useEffect, useState } from 'react';
import ImageDropzone from '../inputs/ImageDropzone';
import { TextInput } from '../inputs/TextInput';
import { supabase } from '../supabase/supabaseClient';
import { ProfileInterface } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { ProfileBadge } from '../profiles/ProfileBadge';

export const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<ProfileInterface>();

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
    if (!image) {
      alert('Please upload an image');
      return;
    }
    if (!description) {
      alert('Please enter a description');
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
      .then(() => {
        setDescription('');
        setImage(null);
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
      <div className="flex flex-col w-full h-[95%] col-span-2 overflow-hidden">
        <ImageDropzone
          onImageUpload={(file) => setImage(file)}
          setError={() => {}}
          image={image}
        />
        {image && (
          <button onClick={() => setImage(null)}>
            (If you want to remove the image, click here)
          </button>
        )}
        <TextInput
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          label="Description"
          type="text-area"
          placeholder=""
        />
        <button onClick={handleCreatePost}>Submit</button>
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
