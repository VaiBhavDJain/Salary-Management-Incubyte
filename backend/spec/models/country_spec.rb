require "rails_helper"

RSpec.describe Country do
  describe ".find" do
    it "returns the country with its name and local currency" do
      expect(described_class.find("IN")).to have_attributes(code: "IN", name: "India", currency: "INR")
    end

    it "returns nil for an unsupported code" do
      expect(described_class.find("XX")).to be_nil
    end
  end

  describe ".codes" do
    it "lists every supported country code" do
      expect(described_class.codes).to contain_exactly("AE", "AU", "CA", "DE", "GB", "IN", "SG", "US")
    end
  end
end
