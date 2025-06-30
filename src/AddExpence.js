import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AddExpense({ user }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('expenses').insert([
      {
        user_id: user.id,
        amount: parseFloat(amount),
        description,
        created_at: new Date().toISOString(),
      }
    ])

    if (error) {
      alert('Error adding expense: ' + error.message)
    } else {
      alert('Expense added!')
      setAmount('')
      setDescription('')
    }
  }

  return (
    <form onSubmit={handleAdd}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  )
}
