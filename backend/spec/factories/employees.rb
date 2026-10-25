FactoryBot.define do
  factory :employee do
    full_name { "Asha Rao" }
    sequence(:email) { |n| "employee#{n}@acme.test" }
    job_title { "Software Engineer" }
    department { "Engineering" }
    country_code { "IN" }
    salary { 1_800_000 }
  end
end
