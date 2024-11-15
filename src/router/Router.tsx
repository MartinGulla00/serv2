import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import { LoginAndSignUp } from '../auth/LoginAndSignUp';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Home } from '../home/Home';
import { CreatePost } from '../posts/CreatePost';
import { ProfileInterface } from '../types';
import { FinishSignup } from '../auth/FinishSignup';
import { Profile } from '../profiles/Profile';

export const Router = () => {
  const [session, setSession] = useState<null | Session>(null);
  const [profile, setProfile] = useState<null | ProfileInterface>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (data && data.length > 0) {
              setProfile(data[0]);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (data && data.length > 0) {
              setProfile(data[0]);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN_AND_SIGNUP} element={<LoginAndSignUp />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN_AND_SIGNUP} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!profile) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.FINISH_SIGNUP} element={<FinishSignup />} />
          <Route path="*" element={<Navigate to={ROUTES.FINISH_SIGNUP} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CREATE_POST} element={<CreatePost />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </BrowserRouter>
  );
};
