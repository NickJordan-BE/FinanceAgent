
import "./index.css"

const BudgetForm = () => {
  return (
    <div className="budget-form-container">
      <form>
        <h1 className="budget-form-header">Create Budget</h1>
        <div className="form-ai-header">
            <h2 className="ai-header">AI Recommendation?</h2>
            <p className="ai-rec">50/30/20</p>
            <button className="ai-rec-btn">Get AI Recommendation</button>
        </div>
        <div className="budget-form-labels-container">
          <label className="income-label">Income:</label>
          <input placeholder="Monthly Income" className="input" type="text" />

          <label className="bill-label">Fixed Expenses:</label>
          <input placeholder="Fixed Expenses or Bills" className="input" type="text" />

          <label className="saving-label">Saving Goal:</label>
          <input placeholder="Saving Goal" className="input"  type="text"/>
          <div>
            <button className="submit-btn">Submit</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BudgetForm
