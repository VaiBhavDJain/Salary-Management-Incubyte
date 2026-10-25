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
end
