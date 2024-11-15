import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileInterface } from '../types';
import useRealtimePosts from '../utils/useRealTimePosts';
import { supabase } from '../supabase/supabaseClient';
import { Posts } from '../posts/Posts';
import { ProfileBadge } from './ProfileBadge';
import { ROUTES } from '../router/routes';
import { SearchProfile } from './SearchProfile';
import { LikeIcon } from '../icons/LikeIcon';
import { CommentIcon } from '../icons/CommentIcon';

export const Profile = () => {
  const { userid } = useParams<{ userid: string }>();

  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
      setLoggedInUserId(data.user.id);
    }
  });

  const [loggedInProfile, setLoggedInProfile] = useState<ProfileInterface>();
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

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', loggedInUserId)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setLoggedInProfile(data[0]);
        }
      });
  }, [loggedInUserId]);

  const posts = useRealtimePosts().filter(
    (post) => post.profile?.user_id === userid
  );

  const handleLogout = () => {
    supabase.auth.signOut();
  };
  const navigate = useNavigate();

  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.likes?.length ?? 0),
    0
  );
  const totalComments = posts.reduce(
    (acc, post) => acc + (post.comments?.length ?? 0),
    0
  );

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
        <SearchProfile />
      </div>
      <div className="flex flex-col w-full h-[95%] col-span-2 overflow-hidden">
        <div className="flex items-center gap-2 justify-center p-3">
          <ProfileBadge profile={profile} />
          <div>-</div>
          <div>{profile?.full_name}</div>
          <div>-</div>
          <div className="flex gap-2 items-center">
            <LikeIcon />
            {totalLikes}
          </div>
          <div>-</div>
          <div className="flex gap-2 items-center">
            <CommentIcon />
            {totalComments}
          </div>
        </div>
        <div className="flex flex-col w-full h-full overflow-scroll">
          <Posts profilePosts={posts} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="flex self-start items-center h-12 rounded-xl border justify-center"
          onClick={() =>
            navigate(ROUTES.PROFILE.replace(':userid', loggedInUserId ?? ''))
          }
        >
          {loggedInProfile ? (
            <ProfileBadge profile={loggedInProfile} />
          ) : (
            'Profile'
          )}
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
