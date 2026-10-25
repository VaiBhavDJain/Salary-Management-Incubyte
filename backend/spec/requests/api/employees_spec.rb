require "rails_helper"

RSpec.describe "Employees API", type: :request do
  let(:employee_attributes) do
    { full_name: "Asha Rao", email: "asha@acme.com", job_title: "Software Engineer",
      department: "Engineering", country_code: "IN", salary: 1_800_000 }
  end

  describe "GET /api/employees" do
    it "lists employees ordered by name" do
      create(:employee, full_name: "Zara Khan")
      create(:employee, full_name: "Asha Rao")

      get "/api/employees"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Asha Rao", "Zara Khan" ])
    end

    it "returns each employee with a numeric salary and the local currency" do
      employee = create(:employee, employee_attributes)

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

    it "searches by name or email" do
      create(:employee, full_name: "Asha Rao")
      create(:employee, full_name: "Ravi Kumar")

      get "/api/employees", params: { q: "kumar" }

      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Ravi Kumar" ])
    end

    it "filters by country, department and job title" do
      create(:employee, full_name: "Asha Rao", country_code: "IN", department: "Engineering", job_title: "Software Engineer")
      create(:employee, full_name: "Emma Brown", country_code: "GB", department: "Engineering", job_title: "Software Engineer")

      get "/api/employees", params: { country_code: "GB", department: "Engineering", job_title: "Software Engineer" }

      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Emma Brown" ])
    end

    it "sorts by salary" do
      create(:employee, full_name: "Asha Rao", salary: 1_000_000)
      create(:employee, full_name: "Ravi Kumar", salary: 2_000_000)

      get "/api/employees", params: { sort: "salary", direction: "desc" }

      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Ravi Kumar", "Asha Rao" ])
    end

    it "paginates the list" do
      %w[Asha Bina Chen].each { |name| create(:employee, full_name: name) }

      get "/api/employees", params: { page: 2, per_page: 2 }

      expect(response.parsed_body["data"].pluck("full_name")).to eq([ "Chen" ])
      expect(response.parsed_body["meta"]).to eq("page" => 2, "per_page" => 2, "total_count" => 3, "total_pages" => 2)
    end
  end

  describe "GET /api/employees/:id" do
    it "returns the employee" do
      employee = create(:employee, full_name: "Asha Rao")

      get "/api/employees/#{employee.id}"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include("id" => employee.id, "full_name" => "Asha Rao")
    end

    it "returns not found for an unknown employee" do
      get "/api/employees/0"

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body).to eq("error" => "Employee not found")
    end
  end

  describe "POST /api/employees" do
    it "creates an employee" do
      expect {
        post "/api/employees", params: { employee: employee_attributes }, as: :json
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body).to include("full_name" => "Asha Rao", "currency" => "INR", "salary" => 1_800_000.0)
    end

    it "returns errors by field for invalid input" do
      post "/api/employees", params: { employee: employee_attributes.merge(email: "", salary: -1) }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]).to eq("email" => [ "can't be blank" ], "salary" => [ "must be greater than 0" ])
    end

    it "returns bad request when the employee payload is missing" do
      post "/api/employees", params: {}, as: :json

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "employee is required")
    end
  end

  describe "PATCH /api/employees/:id" do
    it "updates the employee" do
      employee = create(:employee, salary: 1_800_000)

      patch "/api/employees/#{employee.id}", params: { employee: { salary: 2_000_000 } }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["salary"]).to eq(2_000_000.0)
      expect(employee.reload.salary).to eq(2_000_000)
    end

    it "returns errors by field for invalid input" do
      employee = create(:employee)

      patch "/api/employees/#{employee.id}", params: { employee: { country_code: "XX" } }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]).to eq("country_code" => [ "is not included in the list" ])
    end

    it "returns not found for an unknown employee" do
      patch "/api/employees/0", params: { employee: { salary: 1 } }, as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/employees/:id" do
    it "deletes the employee" do
      employee = create(:employee)

      expect { delete "/api/employees/#{employee.id}" }.to change(Employee, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "returns not found for an unknown employee" do
      delete "/api/employees/0"

      expect(response).to have_http_status(:not_found)
    end
  end
end
