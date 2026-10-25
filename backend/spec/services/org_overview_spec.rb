require "rails_helper"

RSpec.describe OrgOverview do
  subject(:overview) { described_class.new.call }

  before do
    create(:employee, country_code: "US", department: "Engineering", salary: 150_000)
    create(:employee, country_code: "IN", department: "Engineering", salary: 2_000_000)
    create(:employee, country_code: "IN", department: "Sales", salary: 1_000_000)
  end

  it "counts all employees" do
    expect(overview[:headcount]).to eq(3)
  end

  it "summarises pay per country in local currency, largest headcount first" do
    expect(overview[:countries]).to eq([
      { code: "IN", name: "India", currency: "INR", headcount: 2, min_salary: 1_000_000.0, max_salary: 2_000_000.0,
        average_salary: 1_500_000.0, median_salary: 1_500_000.0 },
      { code: "US", name: "United States", currency: "USD", headcount: 1, min_salary: 150_000.0, max_salary: 150_000.0,
        average_salary: 150_000.0, median_salary: 150_000.0 }
    ])
  end

  it "counts employees per department, largest first" do
    expect(overview[:departments]).to eq([
      { department: "Engineering", headcount: 2 },
      { department: "Sales", headcount: 1 }
    ])
  end
end
