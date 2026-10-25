class OrgOverview
  def call
    { headcount: Employee.count, countries:, departments: }
  end

  private

  def countries
    PayInsights.new(Employee.all)
               .breakdown_by(:country_code)
               .map { |row| { **Country.find(row[:country_code]).to_h, **row.except(:country_code) } }
               .sort_by { |row| [ -row[:headcount], row[:name] ] }
  end

  def departments
    Employee.group(:department)
            .order(Arel.sql("COUNT(*) DESC"), :department)
            .count
            .map { |department, headcount| { department:, headcount: } }
  end
end
