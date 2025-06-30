import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ExpenseForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!description || !amount) {
      setMessage({ type: "error", text: "Please fill all fields." });
      return;
    }
    setLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Call the Supabase Edge Function to get category
      const funcRes = await fetch(
        "https://lvroveysnfgmqtdyayiu.functions.supabase.co/categorize-expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ***REMOVED***`,
          },
          body: JSON.stringify({ description }),
        }
      );

      const funcData = await funcRes.json();

      if (!funcRes.ok) {
        throw new Error(funcData.error || "Failed to categorize expense");
      }

      const category = funcData.category || "other";

      // Insert into Supabase table with user_id
      const { data, error } = await supabase.from("expenses").insert([
        {
          user_id: user.id,
          description,
          amount: parseFloat(amount),
          category,
      
        },
      ]);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(error.message || "Failed to save expense");
      }

      setMessage({ type: "success", text: "Expense saved successfully!" });
      setDescription("");
      setAmount("");
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Add Expense</h2>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          required
          placeholder="e.g., Uber ride"
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
      </div>
      <div>
        <label>Amount ($)</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          required
          placeholder="e.g., 15.75"
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
      </div>
      <div>
        <button type="submit" disabled={loading} style={{ padding: 10, width: "30%", marginBottom: 12, marginLeft: "35%" }}>
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </div>
      {message && (
        <p
          style={{
            color: message.type === "error" ? "red" : "green",
            marginTop: 12,
          }}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
