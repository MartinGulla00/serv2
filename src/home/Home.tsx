import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { ROUTES } from '../router/routes';
import { Posts } from '../posts/Posts';
import { useState } from 'react';

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

  const navigate = useNavigate();

  return (
    <div className="w-full grid grid-cols-4 gap-4 text-center overflow-hidden">
      <div className="flex flex-col gap-4 h-screen overflow-hidden">
        <Link to={ROUTES.CREATE_POST}>Create post</Link>
        <input type="text" placeholder="Search" />
        <div className="flex flex-col overflow-scroll">
          <div>persona 1</div>
          <div>persona 2</div>
          <div>persona 3</div>
          <div>persona 4</div>
        </div>
      </div>
      <div className="flex flex-col w-full h-[90%] col-span-2 overflow-scroll">
        <Posts />
      </div>
      <div className="flex gap-4 ">
        <button
          onClick={() =>
            navigate(ROUTES.PROFILE.replace(':userid', userId ?? ''))
          }
        >
          My profile
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col self-start items-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
