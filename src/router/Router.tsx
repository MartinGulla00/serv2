import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import { LoginAndSignUp } from '../auth/LoginAndSignUp';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Home } from '../home/Home';

export const Router = () => {
  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </BrowserRouter>
  );
};
