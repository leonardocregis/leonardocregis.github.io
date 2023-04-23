import Expence from "./Expense";

interface Props {
    expenses: Expence[];
}

function ExpensesTable({expenses}:Props  ) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Valor</th>
                        <th>Location</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id} >
                            <td>{expense.data.toString()}</td>
                            <td>{expense.description}</td>
                            <td>{expense.valor}</td>
                            <td>{expense.location}</td>
                            <td>{expense.category}</td>
                            <td>{expense.subcategory}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpensesTable;