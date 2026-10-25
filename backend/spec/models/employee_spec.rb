require "rails_helper"

RSpec.describe Employee, type: :model do
  it "is valid with all required attributes" do
    expect(build(:employee)).to be_valid
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:full_name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:job_title) }
    it { is_expected.to validate_presence_of(:department) }
    it { is_expected.to validate_presence_of(:country_code) }
    it { is_expected.to validate_presence_of(:salary) }
    it { is_expected.to validate_numericality_of(:salary).is_greater_than(0) }
  end

  describe "database constraints" do
    it "rejects a non-positive salary even when validations are skipped" do
      employee = build(:employee, salary: 0)

      expect { employee.save(validate: false) }.to raise_error(ActiveRecord::CheckViolation)
    end
  end
end
