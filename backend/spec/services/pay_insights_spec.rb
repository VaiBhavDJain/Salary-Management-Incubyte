require "rails_helper"

RSpec.describe PayInsights do
  describe "#summary" do
    it "returns headcount and min, max, average and median salary" do
      [ 100_000, 200_000, 300_000, 1_000_000 ].each { |salary| create(:employee, salary:) }

      expect(described_class.new(Employee.all).summary).to eq(
        headcount: 4, min_salary: 100_000.0, max_salary: 1_000_000.0, average_salary: 400_000.0, median_salary: 250_000.0
      )
    end

    it "only covers employees in the given scope" do
      create(:employee, country_code: "IN", salary: 100_000)
      create(:employee, country_code: "US", salary: 900_000)

      expect(described_class.new(Employee.where(country_code: "IN")).summary).to include(headcount: 1, max_salary: 100_000.0)
    end

    it "rounds salary figures to two decimals" do
      [ 100, 200, 400 ].each { |salary| create(:employee, salary:) }

      expect(described_class.new(Employee.all).summary).to include(average_salary: 233.33)
    end

    it "returns no salary figures when there are no employees" do
      expect(described_class.new(Employee.all).summary).to eq(
        headcount: 0, min_salary: nil, max_salary: nil, average_salary: nil, median_salary: nil
      )
    end
  end
end
