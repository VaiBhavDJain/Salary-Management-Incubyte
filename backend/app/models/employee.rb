class Employee < ApplicationRecord
  validates :full_name, :email, :job_title, :department, :country_code, :salary, presence: true
end
