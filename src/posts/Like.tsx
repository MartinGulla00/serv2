import { ProfileBadge } from '../profiles/ProfileBadge';
import { LikesInterface } from '../types';

export const Like = ({ like }: { like: LikesInterface }) => {
  return (
    <div key={like.id} className="p-2 flex gap-1 items-center">
      <ProfileBadge profile={like.profile} />
    </div>
  );
};
