import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { ROUTES } from '../router/routes';
import { TextInput } from '../inputs/TextInput';

export const ForgotPassword = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleUpdateUser = async () => {
    if (!password) return;
    await supabase.auth.updateUser({
      password,
    });

    navigate(ROUTES.HOME);
  };

  return (
    <div>
      <div>New password</div>
      <TextInput
        value={password}
        onChange={(v) => setPassword(v.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={handleUpdateUser}>Submit</button>
    </div>
  );
};
