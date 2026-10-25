require "rails_helper"

RSpec.describe "Insights API", type: :request do
  describe "GET /api/insights/countries/:code" do
    it "returns the country's salary summary and job title breakdown" do
      create(:employee, country_code: "IN", job_title: "Software Engineer", salary: 2_000_000)
      create(:employee, country_code: "IN", job_title: "Data Analyst", salary: 1_000_000)
      create(:employee, country_code: "US", job_title: "Software Engineer", salary: 150_000)

      get "/api/insights/countries/IN"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["country"]).to eq("code" => "IN", "name" => "India", "currency" => "INR")
      expect(response.parsed_body["summary"]).to include("headcount" => 2, "average_salary" => 1_500_000.0)
      expect(response.parsed_body["job_titles"].pluck("job_title", "headcount")).to eq([ [ "Software Engineer", 1 ], [ "Data Analyst", 1 ] ])
    end

    it "returns not found for an unsupported country" do
      get "/api/insights/countries/XX"

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body).to eq("error" => "Country not found")
    end
  end
end
