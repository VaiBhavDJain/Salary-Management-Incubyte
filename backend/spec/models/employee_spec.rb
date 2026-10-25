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
  end
end
