require "rails_helper"

RSpec.describe "Employees API", type: :request do
  describe "GET /api/employees" do
    it "lists employees ordered by name" do
      create(:employee, full_name: "Zara Khan")
      create(:employee, full_name: "Asha Rao")

      get "/api/employees"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Asha Rao", "Zara Khan" ])
    end

    it "returns each employee with a numeric salary and the local currency" do
      employee = create(:employee, full_name: "Asha Rao", email: "asha@acme.com", job_title: "Software Engineer",
                                   department: "Engineering", country_code: "IN", salary: 1_800_000)

      get "/api/employees"

      expect(response.parsed_body["data"].first).to eq(
        "id" => employee.id,
        "full_name" => "Asha Rao",
        "email" => "asha@acme.com",
        "job_title" => "Software Engineer",
        "department" => "Engineering",
        "country_code" => "IN",
        "currency" => "INR",
        "salary" => 1_800_000.0
      )
    end
  end
end
