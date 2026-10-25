require "rails_helper"

RSpec.describe "Filter options API", type: :request do
  describe "GET /api/filter_options" do
    it "lists supported countries by name" do
      get "/api/filter_options"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["countries"].pluck("name")).to eq(Country.all.map(&:name).sort)
      expect(response.parsed_body["countries"]).to include("code" => "IN", "name" => "India", "currency" => "INR")
    end

    it "lists the departments and job titles in use, without duplicates" do
      create(:employee, department: "Sales", job_title: "Account Executive")
      create_list(:employee, 2, department: "Engineering", job_title: "Software Engineer")

      get "/api/filter_options"

      expect(response.parsed_body["departments"]).to eq([ "Engineering", "Sales" ])
      expect(response.parsed_body["job_titles"]).to eq([ "Account Executive", "Software Engineer" ])
    end
  end
end
