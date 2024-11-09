import { supabase } from '../supabase/supabaseClient';

export const Home = () => {
  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full grid grid-cols-3 gap-4 text-center">
        <div className="col-start-2">Welcome</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
