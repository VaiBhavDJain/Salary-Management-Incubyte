require "rails_helper"

RSpec.describe Seeds::EmployeeSeeder do
  def seeded_rows
    Employee.order(:email).pluck(:full_name, :email, :job_title, :department, :country_code, :salary)
  end

  it "creates the requested number of employees" do
    expect { described_class.new(count: 50).call }.to change(Employee, :count).by(50)
  end

  it "creates employees that pass model validations" do
    described_class.new(count: 50).call

    expect(Employee.all).to all(be_valid)
  end

  it "spreads employees across every supported country" do
    described_class.new(count: 200).call

    expect(Employee.distinct.pluck(:country_code)).to match_array(Country.codes)
  end

  it "gives employees varied names" do
    described_class.new(count: 1_000).call

    expect(Employee.distinct.count(:full_name)).to be > 900
  end

  it "produces the same employees for the same seed" do
    described_class.new(count: 20, seed: 7).call
    first_run = seeded_rows
    Employee.delete_all

    described_class.new(count: 20, seed: 7).call

    expect(seeded_rows).to eq(first_run)
  end
end
