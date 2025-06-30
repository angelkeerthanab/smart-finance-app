// src/AuthPage.jsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";

export default function AuthPage() {
  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: "4rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Smart Finance App</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22525f',
              }
            }
          }
        }}
        providers={[]}
        view="sign_in"
        showLinks={true}
        redirectTo={window.location.origin}
      />
    </div>
  );
}
