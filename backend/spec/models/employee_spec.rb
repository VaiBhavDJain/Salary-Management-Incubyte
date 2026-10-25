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
    it { is_expected.to validate_inclusion_of(:country_code).in_array(Country.codes) }
    it { is_expected.to allow_value("asha.rao@acme.com").for(:email) }
    it { is_expected.not_to allow_values("asha.rao", "asha@", "@acme.com", "asha rao@acme.com").for(:email) }

    it "reports only a blank error for each missing field" do
      employee = described_class.new.tap(&:valid?)

      expect(employee.errors.details).to include(
        email: [ { error: :blank } ],
        country_code: [ { error: :blank } ],
        salary: [ { error: :blank } ]
      )
    end

    it "rejects an email already used by another employee, ignoring case" do
      create(:employee, email: "asha@acme.com")
      duplicate = build(:employee, email: "ASHA@acme.com")

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:email]).to include("has already been taken")
    end
  end

  describe "#currency" do
    it "is the local currency of the employee's country" do
      expect(build(:employee, country_code: "US").currency).to eq("USD")
    end
  end

  describe "normalization" do
    it "downcases and strips the email" do
      expect(described_class.new(email: "  Asha.Rao@ACME.com ").email).to eq("asha.rao@acme.com")
    end

    it "collapses extra whitespace in name, job title and department" do
      employee = described_class.new(full_name: " Asha   Rao ", job_title: "Software  Engineer ", department: " Engineering")

      expect(employee).to have_attributes(full_name: "Asha Rao", job_title: "Software Engineer", department: "Engineering")
    end
  end

  describe "database constraints" do
    it "rejects a non-positive salary even when validations are skipped" do
      employee = build(:employee, salary: 0)

      expect { employee.save(validate: false) }.to raise_error(ActiveRecord::CheckViolation)
    end

    it "rejects a duplicate email even when validations are skipped" do
      create(:employee, email: "asha@acme.com")
      duplicate = build(:employee, email: "asha@acme.com")

      expect { duplicate.save(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
