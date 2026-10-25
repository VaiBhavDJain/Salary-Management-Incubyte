require "rails_helper"

RSpec.describe EmployeeQuery do
  def names(params = {})
    described_class.new(params).call.pluck(:full_name)
  end

  it "orders employees by name by default" do
    create(:employee, full_name: "Zara Khan")
    create(:employee, full_name: "Asha Rao")

    expect(names).to eq([ "Asha Rao", "Zara Khan" ])
  end

  describe "search" do
    before do
      create(:employee, full_name: "Asha Rao", email: "asha@acme.com")
      create(:employee, full_name: "Ravi Kumar", email: "ravi.k@acme.com")
    end

    it "matches part of a name, ignoring case" do
      expect(names(q: "RAO")).to eq([ "Asha Rao" ])
    end

    it "matches part of an email" do
      expect(names(q: "ravi.k@")).to eq([ "Ravi Kumar" ])
    end

    it "treats SQL wildcard characters literally" do
      expect(names(q: "%")).to be_empty
    end

    it "returns everyone for a blank search" do
      expect(names(q: "  ")).to eq([ "Asha Rao", "Ravi Kumar" ])
    end
  end

  describe "filters" do
    before do
      create(:employee, full_name: "Asha Rao", country_code: "IN", department: "Engineering", job_title: "Software Engineer")
      create(:employee, full_name: "Dev Patel", country_code: "IN", department: "Sales", job_title: "Account Executive")
      create(:employee, full_name: "Emma Brown", country_code: "GB", department: "Engineering", job_title: "Software Engineer")
    end

    it "filters by country" do
      expect(names(country_code: "IN")).to eq([ "Asha Rao", "Dev Patel" ])
    end

    it "filters by department" do
      expect(names(department: "Engineering")).to eq([ "Asha Rao", "Emma Brown" ])
    end

    it "filters by job title" do
      expect(names(job_title: "Account Executive")).to eq([ "Dev Patel" ])
    end

    it "combines filters with search" do
      expect(names(country_code: "IN", department: "Engineering", q: "asha")).to eq([ "Asha Rao" ])
    end

    it "ignores blank filter values" do
      expect(names(country_code: "", department: nil)).to eq([ "Asha Rao", "Dev Patel", "Emma Brown" ])
    end
  end

  describe "sorting" do
    before do
      create(:employee, full_name: "Asha Rao", salary: 2_000_000)
      create(:employee, full_name: "Bina Shah", salary: 3_000_000)
      create(:employee, full_name: "Chen Li", salary: 1_000_000)
    end

    it "sorts by salary, highest first" do
      expect(names(sort: "salary", direction: "desc")).to eq([ "Bina Shah", "Asha Rao", "Chen Li" ])
    end

    it "sorts by salary, lowest first" do
      expect(names(sort: "salary", direction: "asc")).to eq([ "Chen Li", "Asha Rao", "Bina Shah" ])
    end

    it "sorts by name in reverse" do
      expect(names(sort: "full_name", direction: "desc")).to eq([ "Chen Li", "Bina Shah", "Asha Rao" ])
    end

    it "falls back to name order for unknown columns and directions" do
      expect(names(sort: "email; DROP TABLE employees", direction: "sideways")).to eq([ "Asha Rao", "Bina Shah", "Chen Li" ])
    end
  end
end
