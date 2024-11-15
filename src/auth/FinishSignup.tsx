import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { TextInput } from '../inputs/TextInput';
import ImageDropzone from '../inputs/ImageDropzone';

export const FinishSignup = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    if (!avatar) {
      return;
    }
    const randomName = Math.random().toString(36).substring(6);
    await supabase.storage
      .from('images')
      .upload(`profiles/${randomName}`, avatar);
    const info = {
      user_id: user?.id,
      username,
      full_name: fullName,
      avatar_url: `profiles/${randomName}`,
    };

    await supabase.from('profiles').insert(info);

    navigate(ROUTES.HOME);
  };

  return (
    <div className="self-center w-1/2">
      <form className="flex flex-col gap-2 items-center">
        <TextInput
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          label="Username"
          placeholder=""
        />
        <TextInput
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
          label="Full Name"
          placeholder=""
        />
        <ImageDropzone
          onImageUpload={(file) => setAvatar(file)}
          setError={() => {}}
          image={avatar}
        />
        <button type="button" onClick={handleCreateProfile}>
          Finish Sign Up
        </button>
      </form>
    </div>
  );
};
