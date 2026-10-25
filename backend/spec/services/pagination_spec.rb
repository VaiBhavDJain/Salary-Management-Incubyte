require "rails_helper"

RSpec.describe Pagination do
  let(:scope) { Employee.order(:id) }

  before { create_list(:employee, 5) }

  it "returns the requested page of records with paging details" do
    pagination = described_class.new(scope, page: "2", per_page: "2")

    expect(pagination.records.map(&:id)).to eq(scope.offset(2).limit(2).ids)
    expect(pagination.meta).to eq(page: 2, per_page: 2, total_count: 5, total_pages: 3)
  end

  it "uses page 1 and 25 per page by default" do
    pagination = described_class.new(scope)

    expect(pagination.meta).to include(page: 1, per_page: 25, total_pages: 1)
  end

  it "falls back to defaults for invalid values" do
    pagination = described_class.new(scope, page: "abc", per_page: "-3")

    expect(pagination.meta).to include(page: 1, per_page: 25)
  end

  it "caps the page size at 100" do
    pagination = described_class.new(scope, per_page: "500")

    expect(pagination.per_page).to eq(100)
  end
end
