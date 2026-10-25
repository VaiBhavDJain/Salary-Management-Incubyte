class AddPositiveSalaryCheckToEmployees < ActiveRecord::Migration[8.1]
  def change
    add_check_constraint :employees, "salary > 0", name: "employees_salary_positive"
  end
end
