import { useEffect, useState } from 'react';
import ImageDropzone from '../inputs/ImageDropzone';
import { TextInput } from '../inputs/TextInput';
import { supabase } from '../supabase/supabaseClient';
import { ProfileInterface } from '../types';

export const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
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
  return (
    <div className="flex flex-col gap-4 items-center w-full">
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
  );
};
