class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :email, null: false
      t.string :job_title, null: false
      t.string :department, null: false
      t.string :country_code, null: false, limit: 2
      t.decimal :salary, null: false, precision: 12, scale: 2

      t.timestamps
    end
  end
end
