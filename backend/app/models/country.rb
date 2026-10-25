class Country < Data.define(:code, :name, :currency)
  ALL = [
    new(code: "IN", name: "India", currency: "INR"),
    new(code: "US", name: "United States", currency: "USD"),
    new(code: "GB", name: "United Kingdom", currency: "GBP"),
    new(code: "DE", name: "Germany", currency: "EUR"),
    new(code: "CA", name: "Canada", currency: "CAD"),
    new(code: "AU", name: "Australia", currency: "AUD"),
    new(code: "SG", name: "Singapore", currency: "SGD"),
    new(code: "AE", name: "United Arab Emirates", currency: "AED")
  ].freeze

  def self.all = ALL
  def self.codes = ALL.map(&:code)
  def self.find(code) = ALL.find { |country| country.code == code }
end
