import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProfileInterface } from '../types';
import useRealtimePosts from '../utils/useRealTimePosts';
import { supabase } from '../supabase/supabaseClient';
import { Posts } from '../posts/Posts';
import { ProfileBadge } from './ProfileBadge';
import { ROUTES } from '../router/routes';

export const Profile = () => {
  const { userid } = useParams<{ userid: string }>();

  const [profile, setProfile] = useState<ProfileInterface>();

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userid)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      });
  }, [userid]);

  const posts = useRealtimePosts().filter(
    (post) => post.profile?.user_id === userid
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full grid grid-cols-4 gap-4 text-center overflow-hidden">
        <div className="flex flex-col items-start gap-2">
          <Link to={ROUTES.HOME}>Go home</Link>
        </div>
        <div className=" col-span-2">
          <Posts profilePosts={posts} />
        </div>
        <div className="flex flex-col items-start gap-2">
          <ProfileBadge profile={profile} />
          <div>Full name: {profile?.full_name}</div>
        </div>
      </div>
    </div>
  );
};
