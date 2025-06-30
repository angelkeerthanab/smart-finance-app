// src/App.js
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthPage from "./AuthPage";
import ExpenseForm from "./components/ExpenceForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Smart Finance App</h1>
        <button 
          onClick={() => supabase.auth.signOut()}
          style={{ 
            padding: "0.5rem 1rem", 
            backgroundColor: "#dc3545", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <ExpenseForm />
      <ExpenseList />
      <ExpenseChart />
     
    </div>
  );
}

export default App;
