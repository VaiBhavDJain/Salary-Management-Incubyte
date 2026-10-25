class AddUniqueIndexToEmployeesEmail < ActiveRecord::Migration[8.1]
  def change
    add_index :employees, :email, unique: true
  end
end
