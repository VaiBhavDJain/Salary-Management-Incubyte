class Employee < ApplicationRecord
  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :full_name, :job_title, :department, with: ->(value) { value.squish }

  validates :full_name, :job_title, :department, presence: true
  validates :email, presence: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP, allow_blank: true },
                    uniqueness: { allow_blank: true }
  validates :country_code, presence: true, inclusion: { in: Country.codes, allow_blank: true }
  validates :salary, presence: true, numericality: { greater_than: 0, allow_nil: true }

  delegate :currency, to: :country, allow_nil: true

  def country
    Country.find(country_code)
  end
end
