import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { ROUTES } from '../router/routes';
import { Posts } from '../posts/Posts';
import { useEffect, useState } from 'react';
import { SearchProfile } from '../profiles/SearchProfile';
import { ProfileBadge } from '../profiles/ProfileBadge';
import { ProfileInterface } from '../types';

export const Home = () => {
  const handleLogout = () => {
    supabase.auth.signOut();
  };
  const [userId, setUserId] = useState<string | null>(null);
  supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
      setUserId(data.user.id);
    }
  });

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

  const navigate = useNavigate();

  return (
    <div className="w-full grid grid-cols-4 gap-4 text-center overflow-hidden">
      <div className="flex flex-col gap-4 h-screen overflow-hidden">
        <button
          className="flex border rounded-xl items-center justify-center h-12"
          type="button"
          onClick={() => navigate(ROUTES.CREATE_POST)}
        >
          Create post
        </button>
        <SearchProfile />
      </div>
      <div className="flex flex-col w-full h-[95%] col-span-2 overflow-hidden">
        <div className="flex items-center gap-2 justify-center p-3 font-semibold text-2xl">
          All posts
        </div>
        <div className="flex flex-col w-full h-full overflow-scroll">
          <Posts />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="flex self-start items-center h-12 rounded-xl border justify-center"
          onClick={() =>
            navigate(ROUTES.PROFILE.replace(':userid', userId ?? ''))
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
