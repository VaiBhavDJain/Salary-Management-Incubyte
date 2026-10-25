class Employee < ApplicationRecord
  validates :full_name, :email, :job_title, :department, :country_code, :salary, presence: true
  validates :salary, numericality: { greater_than: 0 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
end
