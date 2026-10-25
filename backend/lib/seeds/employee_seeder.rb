module Seeds
  class EmployeeSeeder
    BATCH_SIZE = 1_000

    NAMES = YAML.load_file(File.expand_path("names.yml", __dir__)).freeze

    COUNTRIES = {
      "IN" => { weight: 35, pay_multiplier: 22.0 },
      "US" => { weight: 25, pay_multiplier: 1.0 },
      "GB" => { weight: 10, pay_multiplier: 0.62 },
      "DE" => { weight: 8, pay_multiplier: 0.68 },
      "CA" => { weight: 7, pay_multiplier: 1.05 },
      "AU" => { weight: 5, pay_multiplier: 1.15 },
      "SG" => { weight: 5, pay_multiplier: 1.05 },
      "AE" => { weight: 5, pay_multiplier: 2.7 }
    }.freeze

    JOBS = [
      { title: "Software Engineer", department: "Engineering", weight: 18, salary_range: 70_000..120_000 },
      { title: "Senior Software Engineer", department: "Engineering", weight: 10, salary_range: 110_000..170_000 },
      { title: "Engineering Manager", department: "Engineering", weight: 3, salary_range: 150_000..220_000 },
      { title: "QA Engineer", department: "Engineering", weight: 6, salary_range: 55_000..95_000 },
      { title: "DevOps Engineer", department: "Engineering", weight: 4, salary_range: 85_000..140_000 },
      { title: "Data Analyst", department: "Data", weight: 5, salary_range: 60_000..100_000 },
      { title: "Data Scientist", department: "Data", weight: 3, salary_range: 95_000..160_000 },
      { title: "Product Manager", department: "Product", weight: 4, salary_range: 100_000..160_000 },
      { title: "Product Designer", department: "Product", weight: 3, salary_range: 75_000..130_000 },
      { title: "Account Executive", department: "Sales", weight: 9, salary_range: 50_000..100_000 },
      { title: "Sales Manager", department: "Sales", weight: 3, salary_range: 90_000..150_000 },
      { title: "Marketing Specialist", department: "Marketing", weight: 4, salary_range: 45_000..80_000 },
      { title: "Customer Support Specialist", department: "Customer Support", weight: 10, salary_range: 30_000..55_000 },
      { title: "Support Team Lead", department: "Customer Support", weight: 2, salary_range: 50_000..75_000 },
      { title: "Financial Analyst", department: "Finance", weight: 3, salary_range: 60_000..100_000 },
      { title: "Accountant", department: "Finance", weight: 3, salary_range: 50_000..85_000 },
      { title: "HR Generalist", department: "Human Resources", weight: 3, salary_range: 45_000..75_000 },
      { title: "Recruiter", department: "Human Resources", weight: 3, salary_range: 45_000..85_000 },
      { title: "Operations Manager", department: "Operations", weight: 2, salary_range: 70_000..120_000 }
    ].freeze

    COUNTRY_POOL = COUNTRIES.flat_map { |code, country| [ code ] * country[:weight] }.freeze
    JOB_POOL = JOBS.flat_map { |job| [ job ] * job[:weight] }.freeze

    def initialize(count:, seed: 42)
      @count = count
      @random = Random.new(seed)
    end

    def call
      (1..@count).each_slice(BATCH_SIZE) do |numbers|
        Employee.insert_all!(numbers.map { |number| employee_attributes(number) })
      end

      @count
    end

    private

    def employee_attributes(number)
      country_code = COUNTRY_POOL.sample(random: @random)
      country = COUNTRIES.fetch(country_code)
      job = JOB_POOL.sample(random: @random)
      first_name = NAMES.dig(country_code, "first_names").sample(random: @random)
      last_name = NAMES.dig(country_code, "last_names").sample(random: @random)

      {
        full_name: "#{first_name} #{last_name}",
        email: "#{first_name}.#{last_name}.#{number}@acme.example".downcase,
        job_title: job[:title],
        department: job[:department],
        country_code:,
        salary: (@random.rand(job[:salary_range]) * country[:pay_multiplier]).round(-2)
      }
    end
  end
end
