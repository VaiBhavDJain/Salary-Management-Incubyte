class AddIndexesForEmployeeListAndInsights < ActiveRecord::Migration[8.1]
  def change
    add_index :employees, %i[full_name id]
    add_index :employees, %i[country_code job_title]
    add_index :employees, :department
  end
end
