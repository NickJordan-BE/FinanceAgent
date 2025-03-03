
import "./index.css"

const Budget = () => {
  return (
    <div className="budget-container">
        <div className="budget-heading">
            <h1 className="budget-month">Current Month: </h1>
            <h2 className="budget-rule">Current Budget Rule: </h2>
            <h3 className="budget-exp-heading">Budget Explanation</h3>
            <p className="budget-exp">50/30/20</p>
        </div>
        <div className="budget-stats">
            <h1 className="budget-stats-header">Budget stats</h1>
        </div>
    </div>
  )
}

export default Budget
