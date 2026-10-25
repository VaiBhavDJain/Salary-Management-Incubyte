class Employee < ApplicationRecord
  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :full_name, :job_title, :department, with: ->(value) { value.squish }

  validates :full_name, :email, :job_title, :department, :country_code, :salary, presence: true
  validates :salary, numericality: { greater_than: 0 }, allow_nil: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true, allow_blank: true
  validates :country_code, inclusion: { in: Country.codes }, allow_blank: true

  delegate :currency, to: :country, allow_nil: true

  def country
    Country.find(country_code)
  end
end
