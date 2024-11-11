import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { ProfileInterface } from '../types';
import { ProfileBadge } from './ProfileBadge';
import { TextInput } from '../inputs/TextInput';

export const SearchProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<ProfileInterface[]>([]);

  const searchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      .order('full_name', { ascending: true })
      .limit(10);

    if (data) {
      setProfiles(data);
    }
  };

  useEffect(() => {
    searchProfiles();
  }, [searchTerm]);

  return (
    <>
      <TextInput
        value={searchTerm}
        onChange={(v) => setSearchTerm(v.target.value)}
        placeholder="Search profiles"
      />
      <div className="flex flex-col overflow-scroll gap-2 pl-2">
        {profiles.map((profile) => (
          <div className="flex gap-2 items-center">
            <ProfileBadge profile={profile} />-<div>{profile.full_name}</div>
          </div>
        ))}
      </div>
    </>
  );
};
