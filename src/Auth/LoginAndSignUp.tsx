import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase/supabaseClient';

export const LoginAndSignUp = () => {
  return (
    <div className="self-center w-1/2">
      <Auth
        magicLink
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        // redirectTo={"/finish-set-up"} TODO: look into how the redirect works, need to send to finish set up page
      />
    </div>
  );
};
