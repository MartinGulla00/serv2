import { useNavigate } from 'react-router-dom';
import { ProfileInterface } from '../types';
import { ROUTES } from '../router/routes';

export const ProfileBadge = ({ profile }: { profile?: ProfileInterface }) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center gap-1 font-bold"
      onClick={() =>
        navigate(ROUTES.PROFILE.replace(':userid', profile?.user_id ?? ''))
      }
      type="button"
    >
      <img
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${profile?.avatar_url}`}
        alt={profile?.username}
        className="h-8 w-8 rounded-full"
      />
      <div>{profile?.username}</div>
    </button>
  );
};
